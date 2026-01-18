/**
 * EXAMPLE: How to use BaseService with your Prisma models
 *
 * This file demonstrates how to extend BaseService for your entities.
 * Copy and adapt this pattern for your actual services.
 */

import { PrismaClient, type eventInformation, eventStatus } from '@prisma/client';
import { BaseService } from './base.service.js';
import type {PaginationDto, PaginatedResponseDto} from './pagination.dto.js';

// Initialize Prisma client (typically done once and shared)
const prisma = new PrismaClient();

// Define your DTOs
interface CreateEventDto {
  tenantId: string;
  eventOwnerId: string;
  eventYear: string;
  eventName: string;
  startDate: Date;
  endDate: Date;
  eventStatus: eventStatus;
  accommodationNeeded: boolean;
  registrationOpenAt: Date;
  registrationCloseAt: Date;
}

interface UpdateEventDto {
  eventName?: string;
  startDate?: Date;
  endDate?: Date;
  eventStatus?: eventStatus;
  accommodationNeeded?: boolean;
  registrationOpenAt?: Date;
  registrationCloseAt?: Date;
}

/**
 * EventsService extending BaseService
 *
 * This provides all CRUD operations automatically:
 * - create(data)
 * - modify(id, data)
 * - findByPk(id)
 * - activate(ids)
 * - deactivate(ids)
 * - remove(id)
 * - paginate(paginationDto)
 */
class EventsService extends BaseService<
  eventInformation,
  CreateEventDto,
  UpdateEventDto,
  string
> {
  constructor() {
    super(
      prisma,
      prisma.eventInformation,
      {
        primaryKey: 'eventId',
        statusField: 'eventStatus',
        searchableFields: ['eventName', 'eventYear'],
        defaultOrderBy: { createdAt: 'desc' },
      }
    );
  }

  /**
   * Custom method: Find events by owner
   */
  async findByOwner(ownerId: string): Promise<eventInformation[]> {
    return this.findMany({
      where: { eventOwnerId: ownerId },
    });
  }

  /**
   * Custom method: Find active events
   */
  async findActiveEvents(): Promise<eventInformation[]> {
    return this.findMany({
      where: { eventStatus: 'ACTIVE' },
      orderBy: { startDate: 'asc' },
    });
  }

  /**
   * Custom method: Find events with registration open
   */
  async findOpenForRegistration(): Promise<eventInformation[]> {
    const now = new Date();
    return this.findMany({
      where: {
        registrationOpenAt: { lte: now },
        registrationCloseAt: { gte: now },
        eventStatus: 'ACTIVE',
      },
    });
  }

  /**
   * Custom method: Paginate events by owner
   */
  async paginateByOwner(
    ownerId: string,
    paginationDto: PaginationDto
  ): Promise<PaginatedResponseDto<eventInformation>> {
    return this.paginateWithWhere(
      paginationDto,
      { eventOwnerId: ownerId },
      { registrants: true } // Include relations
    );
  }

  /**
   * Custom method: Check if event name exists
   */
  async eventNameExists(name: string, excludeId?: string): Promise<boolean> {
    const where: Record<string, any> = { eventName: name };
    if (excludeId) {
      where.eventId = { not: excludeId };
    }
    return this.exists(where);
  }
}

// Export singleton instance
export const eventsService = new EventsService();


// ============================================
// USAGE EXAMPLES
// ============================================

async function examples() {
  // Create an event
  const newEvent = await eventsService.create({
    tenantId: 'tenant-123',
    eventOwnerId: 'admin-456',
    eventYear: '2026',
    eventName: 'Annual Conference',
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-03'),
    eventStatus: 'DRAFT',
    accommodationNeeded: true,
    registrationOpenAt: new Date('2026-04-01'),
    registrationCloseAt: new Date('2026-05-25'),
  });

  // Find by ID
  const event = await eventsService.findByPk('event-id-123');

  // Update an event
  const updated = await eventsService.modify('event-id-123', {
    eventName: 'Updated Conference Name',
    eventStatus: 'ACTIVE',
  });

  // Paginate with search
  const paginatedEvents = await eventsService.paginate({
    page: 1,
    limit: 10,
    search: 'conference',
    sortBy: 'startDate',
    sortOrder: 'asc',
  });

  // Use custom methods
  const activeEvents = await eventsService.findActiveEvents();
  const ownerEvents = await eventsService.findByOwner('admin-456');

  // Soft delete (if status field is configured)
  await eventsService.deactivate(['event-id-1', 'event-id-2']);

  // Hard delete
  await eventsService.remove('event-id-123');
}
