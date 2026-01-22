import type { Response } from "express";
import { EventRegistrationService } from "../service/event-registration.service.js";
import * as response from "@api/ApiResponseContract.js";
import { handleZodError } from "@api/exceptions/exceptionsHandler.js";
import type { AuthenticatedUser } from "@api/middleware/auth.js";
import type { AuthenticatedAdminUser } from "@api/middleware/adminAuth.js";
import type { PaginationDto } from "@common/pagination.dto.js";
import { createEventRegistrationSchema, updateEventRegistrationSchema } from "@api/events/models/event-registration.model.js";

class EventRegistrationController {
    private readonly registrationService: EventRegistrationService;

    constructor() {
        this.registrationService = new EventRegistrationService();
    }

    async getAllRegistrations(req: AuthenticatedAdminUser, res: Response) {
        if (!req.adminId) {
            return response.unauthorizedRequest(res, "Request not authorized. Please try again later");
        }

        const paginationDto: PaginationDto = {
            ...(req.query.page && { page: Number(req.query.page) }),
            ...(req.query.limit && { limit: Number(req.query.limit) }),
            ...(req.query.sortBy && { sortBy: req.query.sortBy as string }),
            ...(req.query.sortOrder && { sortOrder: req.query.sortOrder as 'asc' | 'desc' }),
            ...(req.query.search && { search: req.query.search as string }),
        };

        return await this.registrationService.getAllRegistrations(res, paginationDto);
    }

    async getRegistrationById(req: AuthenticatedUser, res: Response) {
        const id = req.params.id;

        if (!id || typeof id !== 'string') {
            return response.badRequest(res, "Registration ID is required");
        }

        return await this.registrationService.getRegistrationById(res, id);
    }

    async getRegistrationsByEventId(req: AuthenticatedUser, res: Response) {
        const eventId = req.params.eventId;

        if (!eventId || typeof eventId !== 'string') {
            return response.badRequest(res, "Event ID is required");
        }

        const paginationDto: PaginationDto = {
            ...(req.query.page && { page: Number(req.query.page) }),
            ...(req.query.limit && { limit: Number(req.query.limit) }),
            ...(req.query.sortBy && { sortBy: req.query.sortBy as string }),
            ...(req.query.sortOrder && { sortOrder: req.query.sortOrder as 'asc' | 'desc' }),
            ...(req.query.search && { search: req.query.search as string }),
        };

        return await this.registrationService.getRegistrationsByEventId(res, eventId, paginationDto);
    }

    async getMyRegistrations(req: AuthenticatedUser, res: Response) {
        if (!req.userId) {
            return response.unauthorizedRequest(res, "Request not authorized. Please try again later");
        }

        const paginationDto: PaginationDto = {
            ...(req.query.page && { page: Number(req.query.page) }),
            ...(req.query.limit && { limit: Number(req.query.limit) }),
            ...(req.query.sortBy && { sortBy: req.query.sortBy as string }),
            ...(req.query.sortOrder && { sortOrder: req.query.sortOrder as 'asc' | 'desc' }),
            ...(req.query.search && { search: req.query.search as string }),
        };

        return await this.registrationService.getRegistrationsByUserId(res, req.userId, paginationDto);
    }

    async createRegistration(req: AuthenticatedUser, res: Response) {
        if (!req.userId) {
            return response.unauthorizedRequest(res, "Request not authorized. Please try again later");
        }

        const result = createEventRegistrationSchema.safeParse({
            ...req.body,
            userId: req.userId,
            initiator: "USER",
        });

        if (!result.success) return handleZodError(res, result.error);

        return await this.registrationService.createRegistration(res, result.data);
    }

    async adminCreateRegistration(req: AuthenticatedAdminUser, res: Response) {
        if (!req.adminId) {
            return response.unauthorizedRequest(res, "Request not authorized. Please try again later");
        }

        const result = createEventRegistrationSchema.safeParse({
            ...req.body,
            initiator: "ADMIN",
        });

        if (!result.success) return handleZodError(res, result.error);

        return await this.registrationService.createRegistration(res, result.data);
    }

    async updateRegistration(req: AuthenticatedAdminUser, res: Response) {
        if (!req.adminId) {
            return response.unauthorizedRequest(res, "Request not authorized. Please try again later");
        }

        const id = req.params.id;
        if (!id || typeof id !== 'string') {
            return response.badRequest(res, "Registration ID is required");
        }

        const result = updateEventRegistrationSchema.safeParse(req.body);
        if (!result.success) return handleZodError(res, result.error);

        return await this.registrationService.updateRegistration(res, id, result.data);
    }

    async deleteRegistration(req: AuthenticatedAdminUser, res: Response) {
        if (!req.adminId) {
            return response.unauthorizedRequest(res, "Request not authorized. Please try again later");
        }

        const id = req.params.id;
        if (!id || typeof id !== 'string') {
            return response.badRequest(res, "Registration ID is required");
        }

        return await this.registrationService.deleteRegistration(res, id);
    }
}

export const eventRegistrationController = new EventRegistrationController();
