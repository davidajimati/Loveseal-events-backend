import type {PaginationDto, PaginatedResponseDto} from './pagination.dto.js';

/**
 * Base interface defining standard CRUD operations for entity services
 * @template T - The entity type
 * @template CreateDto - The DTO type for creating entities
 * @template UpdateDto - The DTO type for updating entities
 * @template IdType - The type of the primary key (default: string for UUID)
 */
export interface EntityServiceStrategy<
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
  IdType = string
> {
  create(data: CreateDto): Promise<T>;
  modify(id: IdType, data: UpdateDto): Promise<T>;
  findByPk(id: IdType): Promise<T | null>;
  activate(ids: IdType[]): Promise<void>;
  deactivate(ids: IdType[]): Promise<void>;
  remove(id: IdType): Promise<void>;
  paginate(paginationDto: PaginationDto): Promise<PaginatedResponseDto<T>>;
}

/**
 * Entity status enum for soft delete pattern
 */
export enum EntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

/**
 * Database action enum for validation
 */
export enum DatabaseAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

/**
 * Validation strategy interface for entity validation
 * @template T - The entity type
 */
export interface ValidationStrategy<T> {
  validate(entity: T, action: DatabaseAction): void | Promise<void>;
}
