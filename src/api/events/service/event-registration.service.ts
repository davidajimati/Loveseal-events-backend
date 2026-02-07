import type {Response} from "express";
import {Prisma, type eventRegistrationTable} from "@prisma/client";
import {BaseService} from "../../../common/index.js";
import prisma from "../../../../prisma/Prisma.js";
import * as response from "../../ApiResponseContract.js";
import type {PaginationDto} from "../../../common/index.js";
import {
    type CreateEventRegistrationType,
    ParticipationModeEnum,
    type UpdateEventRegistrationType
} from "../models/event-registration.model.js";

export class EventRegistrationService extends BaseService<eventRegistrationTable, CreateEventRegistrationType, UpdateEventRegistrationType> {
    constructor() {
        super(prisma, prisma.eventRegistrationTable, {
            primaryKey: 'regId',
            statusField: 'status',
            searchableFields: [],
        });
    }

    async getAllRegistrations(res: Response, paginationDto: PaginationDto) {
        try {
            const result = await this.paginate(paginationDto);
            return response.successResponse(res, result);
        } catch (error) {
            console.log("Exception: " + error);
            return response.internalServerError(res, "Something went wrong. Please try again.");
        }
    }

    async getRegistrationById(res: Response, regId: string) {
        try {
            const registration = await this.findByPk(regId);
            if (!registration) {
                return response.notFound(res, "Registration not found");
            }
            return response.successResponse(res, registration);
        } catch (error) {
            console.log("Exception: " + error);
            return response.internalServerError(res, "Something went wrong. Please try again.");
        }
    }

    async getRegistrationsByEventId(res: Response, eventId: string, paginationDto: PaginationDto) {
        try {
            const result = await this.paginateWithWhere(paginationDto, {eventId});
            return response.successResponse(res, result);
        } catch (error) {
            console.log("Exception: " + error);
            return response.internalServerError(res, "Something went wrong. Please try again.");
        }
    }

    async getRegistrationsByUserId(res: Response, userId: string, paginationDto: PaginationDto) {
        try {
            const result = await this.paginateWithWhere(paginationDto, {userId});
            return response.successResponse(res, result);
        } catch (error) {
            console.log("Exception: " + error);
            return response.internalServerError(res, "Something went wrong. Please try again.");
        }
    }

    async createRegistration(res: Response, data: CreateEventRegistrationType) {
        try {
            // Check if user is already registered for this event
            const existingRegistration = await this.findFirst({
                userId: data.userId,
                eventId: data.eventId,
            });

            let registration;
            const {initiator, ...rest} = data;

            if (existingRegistration) {
                console.log("user registration already exists. Updating registration...")
                registration = await this.delegate.update({
                    where: {
                        regId: existingRegistration.regId,
                    },
                    data: {
                        participationMode: data.participationMode,
                        initiator: data.initiator,
                        accommodationType: data.accommodationType,
                    }
                });
            } else {
                const dbData = {
                    ...rest,
                    initiator: initiator,
                    accommodationAssigned: false,
                    accommodationDetails: "",
                }
                registration = await this.delegate.create({
                    data: dbData
                });
            }

            return response.successResponse(res, registration);
        } catch (error) {
            console.log("Exception: " + error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return response.duplicateRequest(res, "A registration with same info already exists");
                }
                if (error.code === "P2003") {
                    return response.badRequest(res, "Invalid user or event ID");
                }
            }
            return response.internalServerError(res, "Something went wrong. Please try again.");
        }
    }

    async updateRegistration(res: Response, regId: string, data: Partial<UpdateEventRegistrationType>) {
        try {
            const {initiator, ...rest} = data;
            const updateData: Record<string, any> = {...rest};

            if (initiator) {
                updateData.intiator = initiator;
            }

            const registration = await this.delegate.update({
                where: {regId},
                data: updateData,
            });

            return response.successResponse(res, registration);
        } catch (error) {
            console.log("Exception: " + error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    return response.notFound(res, "Registration not found");
                }
            }
            return response.internalServerError(res, "Something went wrong. Please try again.");
        }
    }

    async deleteRegistration(res: Response, regId: string) {
        try {
            const deletedRecord = await prisma.eventRegistrationTable.delete({
                where: {
                    regId
                }
            });
            console.log("deletedRecord: " + deletedRecord);
            return response.successResponse(res, "Registration deleted");
        } catch (error) {
            console.log("Exception: " + error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    return response.notFound(res, "Registration not found");
                }
            }
            return response.internalServerError(res, "Something went wrong. Please try again.");
        }
    }
}
