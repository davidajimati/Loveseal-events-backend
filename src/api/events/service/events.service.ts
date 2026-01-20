import type {Response} from "express";
import {Prisma, type eventInformation} from "@prisma/client";
import {BaseService} from "@common/index.js";
import prisma from "@prisma/Prisma.js";
import * as response from "@api/ApiResponseContract.js";
import type {CreateEventType, UpdateEventType} from "../events.model.js";
import type {PaginationDto} from "@common/pagination.dto.js";

export class EventsService extends BaseService<eventInformation, CreateEventType, UpdateEventType> {
    constructor() {
        super(prisma, prisma.eventInformation, {
            primaryKey: 'eventId',
            statusField: 'eventStatus',
            searchableFields: ['eventName', 'eventYear'],
        });
    }

    async getAllEvents(res: Response, paginationDto: PaginationDto) {
        try {
            const result = await this.paginate(paginationDto);
            return response.successResponse(res, result);
        } catch (error) {
            console.log("Exception: " + error);
            return response.internalServerError(res, "Something went wrong. Please try again.");
        }
    }

    async retrieveActiveEvents(res: Response) {
        const activeEvents = await prisma.eventInformation.findMany({
            where: {
                eventStatus: "ACTIVE"
            }
        });
        return response.successResponse(res, {activeEvents});
    }

    async getEventById(res: Response, eventId: string) {
        try {
            const event = await this.findByPk(eventId);
            if (!event) {
                return response.notFound(res, "Event not found");
            }
            return response.successResponse(res, event);
        } catch (error) {
            console.log("Exception: " + error);
            return response.internalServerError(res, "Something went wrong. Please try again.");
        }
    }

    async createEvent(res: Response, data: CreateEventType) {
        try {
            const event = await this.create(data);
            return response.successResponse(res, event);
        } catch (error) {
            console.log("Exception: " + error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return response.duplicateRequest(res, "An event with same info already exists");
                }
            }
            return response.internalServerError(res, "Something went wrong. Please try again.");
        }
    }

    async updateEvent(res: Response, eventId: string, data: UpdateEventType) {
        try {
            const event = await this.modify(eventId, data);
            return response.successResponse(res, event);
        } catch (error) {
            console.log("Exception: " + error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    return response.notFound(res, "Event not found");
                }
            }
            return response.internalServerError(res, "Something went wrong. Please try again.");
        }
    }

    async deleteEvent(res: Response, eventId: string) {
        try {
            await this.remove(eventId);
            return response.successResponse(res, "Event deleted");
        } catch (error) {
            console.log("Exception: " + error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    return response.notFound(res, "Event not found");
                }
            }
            return response.internalServerError(res, "Something went wrong. Please try again.");
        }
    }
}
