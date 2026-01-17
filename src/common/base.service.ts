import { PrismaClient } from '@prisma/client';
import {
  type EntityServiceStrategy,
  EntityStatus,
  DatabaseAction,
  type ValidationStrategy,
} from './entity.service.strategy.js';
import {
  type PaginationDto,
  type PaginatedResponseDto,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  DEFAULT_SORT_ORDER,
  buildPaginationMeta,
} from './pagination.dto.js';

/**
 * Type helper for Prisma model delegates
 * Extracts the delegate type from PrismaClient
 */
type PrismaDelegate = {
  findUnique: Function;
  findFirst: Function;
  findMany: Function;
  create: Function;
  update: Function;
  delete: Function;
  count: Function;
  updateMany: Function;
};

/**
 * Configuration for BaseService
 */
export interface BaseServiceConfig<T> {
  primaryKey: string;
  statusField?: string;
  searchableFields?: (keyof T)[];
  defaultOrderBy?: Record<string, 'asc' | 'desc'>;
}

/**
 * Abstract base service class implementing common CRUD operations for Prisma
 * @template T - The entity type
 * @template CreateDto - The DTO type for creating entities
 * @template UpdateDto - The DTO type for updating entities
 * @template IdType - The type of the primary key
 */
export abstract class BaseService<
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
  IdType = string
> implements EntityServiceStrategy<T, CreateDto, UpdateDto, IdType>
{
  protected readonly config: BaseServiceConfig<T>;

  protected constructor(
    protected readonly prisma: PrismaClient,
    protected readonly delegate: PrismaDelegate,
    config: Partial<BaseServiceConfig<T>> = {},
    protected readonly validator?: ValidationStrategy<T>
  ) {
    this.config = {
      primaryKey: config.primaryKey || 'id',
      ...(config.statusField !== undefined && { statusField: config.statusField }),
      searchableFields: config.searchableFields || [],
      defaultOrderBy: config.defaultOrderBy || { createdAt: 'desc' },
    };
  }

  /**
   * Validate entity before database operation
   */
  protected async validateEntity(entity: T, action: DatabaseAction): Promise<void> {
    if (this.validator) {
      await this.validator.validate(entity, action);
    }
  }

  /**
   * Build where clause for primary key lookup
   */
  protected buildPkWhere(id: IdType): Record<string, IdType> {
    return { [this.config.primaryKey]: id };
  }

  /**
   * Create a new entity
   */
  async create(data: CreateDto): Promise<T> {
    await this.validateEntity(data as unknown as T, DatabaseAction.CREATE);
    return this.delegate.create({ data }) as Promise<T>;
  }

  /**
   * Update an existing entity
   */
  async modify(id: IdType, data: UpdateDto): Promise<T> {
    const existing = await this.findByPk(id);
    if (!existing) {
      throw new Error(`Entity with ${this.config.primaryKey}=${id} not found`);
    }

    await this.validateEntity({ ...existing, ...data } as T, DatabaseAction.UPDATE);

    return this.delegate.update({
      where: this.buildPkWhere(id),
      data,
    }) as Promise<T>;
  }

  /**
   * Find entity by primary key
   */
  async findByPk(id: IdType): Promise<T | null> {
    return this.delegate.findUnique({
      where: this.buildPkWhere(id),
    }) as Promise<T | null>;
  }

  /**
   * Find first entity matching conditions
   */
  protected async findFirst(where: Record<string, any>): Promise<T | null> {
    return this.delegate.findFirst({ where }) as Promise<T | null>;
  }

  /**
   * Find all entities matching conditions
   */
  protected async findMany(options: {
    where?: Record<string, any>;
    orderBy?: Record<string, 'asc' | 'desc'>;
    skip?: number;
    take?: number;
    include?: Record<string, any>;
  }): Promise<T[]> {
    return this.delegate.findMany(options) as Promise<T[]>;
  }

  /**
   * Count entities matching conditions
   */
  protected async count(where?: Record<string, any>): Promise<number> {
    return this.delegate.count({ where }) as Promise<number>;
  }

  /**
   * Check if entity exists
   */
  async exists(where: Record<string, any>): Promise<boolean> {
    const count = await this.count(where);
    return count > 0;
  }

  /**
   * Set status for multiple entities (soft activate/deactivate)
   */
  protected async setStatus(ids: IdType[], status: EntityStatus): Promise<void> {
    if (!this.config.statusField) {
      throw new Error('Status field not configured for this service');
    }

    await this.delegate.updateMany({
      where: {
        [this.config.primaryKey]: { in: ids },
      },
      data: {
        [this.config.statusField]: status,
      },
    });
  }

  /**
   * Activate entities by IDs
   */
  async activate(ids: IdType[]): Promise<void> {
    return this.setStatus(ids, EntityStatus.ACTIVE);
  }

  /**
   * Deactivate entities by IDs
   */
  async deactivate(ids: IdType[]): Promise<void> {
    return this.setStatus(ids, EntityStatus.INACTIVE);
  }

  /**
   * Remove entity by ID (hard delete)
   */
  async remove(id: IdType): Promise<void> {
    const existing = await this.findByPk(id);
    if (!existing) {
      throw new Error(`Entity with ${this.config.primaryKey}=${id} not found`);
    }

    await this.delegate.delete({
      where: this.buildPkWhere(id),
    });
  }

  /**
   * Build search filter for pagination
   */
  protected buildSearchFilter(search?: string): Record<string, any> | undefined {
    if (!search || this.config.searchableFields?.length === 0) {
      return undefined;
    }

    return {
      OR: this.config.searchableFields?.map((field) => ({
        [field]: { contains: search },
      })),
    };
  }

  /**
   * Paginate entities
   */
  async paginate(paginationDto: PaginationDto): Promise<PaginatedResponseDto<T>> {
    const page = paginationDto.page || DEFAULT_PAGE;
    const limit = paginationDto.limit || DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const orderBy = paginationDto.sortBy
      ? { [paginationDto.sortBy]: paginationDto.sortOrder || DEFAULT_SORT_ORDER }
      : this.config.defaultOrderBy;

    const searchFilter = this.buildSearchFilter(paginationDto.search);

    const [data, totalItems] = await Promise.all([
      this.findMany({
        ...(searchFilter !== undefined && { where: searchFilter }),
        ...(orderBy !== undefined && { orderBy }),
        skip,
        take: limit,
      }),
      this.count(searchFilter),
    ]);

    return {
      data,
      meta: buildPaginationMeta(page, limit, totalItems),
    };
  }

  /**
   * Paginate with custom where clause
   */
  protected async paginateWithWhere(
    paginationDto: PaginationDto,
    where: Record<string, any>,
    include?: Record<string, any>
  ): Promise<PaginatedResponseDto<T>> {
    const page = paginationDto.page || DEFAULT_PAGE;
    const limit = paginationDto.limit || DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const orderBy = paginationDto.sortBy
      ? { [paginationDto.sortBy]: paginationDto.sortOrder || DEFAULT_SORT_ORDER }
      : this.config.defaultOrderBy;

    const searchFilter = this.buildSearchFilter(paginationDto.search);
    const combinedWhere = searchFilter ? { AND: [where, searchFilter] } : where;

    const [data, totalItems] = await Promise.all([
      this.delegate.findMany({
        where: combinedWhere,
        ...(orderBy !== undefined && { orderBy }),
        skip,
        take: limit,
        ...(include !== undefined && { include }),
      }) as Promise<T[]>,
      this.count(combinedWhere),
    ]);

    return {
      data,
      meta: buildPaginationMeta(page, limit, totalItems),
    };
  }
}
