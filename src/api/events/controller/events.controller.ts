import type { Response } from "express";
import { EventsService } from "../service/events.service.js";
import * as response from "@api/ApiResponseContract.js";
import { handleZodError } from "@api/exceptions/exceptionsHandler.js";
import { createEventSchema, updateEventSchema } from "../events.model.js";
import type { AuthenticatedUser } from "@api/middleware/auth.js";
import type { AuthenticatedAdminUser } from "@api/middleware/adminAuth.js";
import type { PaginationDto } from "@common/pagination.dto.js";

class EventsController {
    private readonly eventsService: EventsService;

    constructor() {
        this.eventsService = new EventsService();
    }

    async getAllEvents(req: AuthenticatedUser, res: Response) {
        const paginationDto: PaginationDto = {
            ...(req.query.page && { page: Number(req.query.page) }),
            ...(req.query.limit && { limit: Number(req.query.limit) }),
            ...(req.query.sortBy && { sortBy: req.query.sortBy as string }),
            ...(req.query.sortOrder && { sortOrder: req.query.sortOrder as 'asc' | 'desc' }),
            ...(req.query.search && { search: req.query.search as string }),
        };

        return await this.eventsService.getAllEvents(res, paginationDto);
    }

    async getEventById(req: AuthenticatedUser, res: Response) {
        const id = req.params.id;

        if (!id || typeof id !== 'string') {
            return response.badRequest(res, "Event ID is required");
        }

        return await this.eventsService.getEventById(res, id);
    }

    async createEvent(req: AuthenticatedAdminUser, res: Response) {
        if (!req.adminId) {
            return response.unauthorizedRequest(res, "Request not authorized. Please try again later");
        }

        const result = createEventSchema.safeParse(req.body);
        if (!result.success) return handleZodError(res, result.error);

        return await this.eventsService.createEvent(res, result.data);
    }

    async updateEvent(req: AuthenticatedAdminUser, res: Response) {
        if (!req.adminId) {
            return response.unauthorizedRequest(res, "Request not authorized. Please try again later");
        }

        const id = req.params.id;
        if (!id || typeof id !== 'string') {
            return response.badRequest(res, "Event ID is required");
        }

        const result = updateEventSchema.safeParse(req.body);
        if (!result.success) return handleZodError(res, result.error);

        return await this.eventsService.updateEvent(res, id, result.data);
    }

    async deleteEvent(req: AuthenticatedAdminUser, res: Response) {
        if (!req.adminId) {
            return response.unauthorizedRequest(res, "Request not authorized. Please try again later");
        }

        const id = req.params.id;
        if (!id || typeof id !== 'string') {
            return response.badRequest(res, "Event ID is required");
        }

        return await this.eventsService.deleteEvent(res, id);
    }
}

export const eventsController = new EventsController();
