import type {Request, Response} from "express";
import {handleZodError} from "../../exceptions/exceptionsHandler.js";
import {
    createAccommodationCategorySchema,
    createAccommodationFacilitySchema,
    createHostelAccommodationSchema,
    createHotelAccommodationSchema,
} from "../model/accommodation.model.js";
import * as service from "../service/accommodation.service.js";
import * as response from "../../ApiResponseContract.js";
import {BillingService} from "../../billing/service/billing.service.js";

async function createFacility(req: Request, res: Response) {
    const result = createAccommodationFacilitySchema.safeParse(req.body);

    if (!result.success) {
        return handleZodError(res, result.error);
    }
    return await service.createAccommodationFacility(res, result.data);
}

async function createCategories(req: Request, res: Response) {
    const eventId = asSingleString((req.params as any).eventId);

    if (!eventId) {
        return response.badRequest(res, "eventId is required");
    }

    const result = createAccommodationCategorySchema.safeParse(req.body);

    if (!result.success) {
        return handleZodError(res, result.error);
    }
    return await service.createAccommodationCategory(res, result.data);
}

async function createHostelAccommodation(req: Request, res: Response) {
    const result = createHostelAccommodationSchema.safeParse(req.body);

    if (!result.success) {
        return handleZodError(res, result.error);
    }
    return await service.createHostelAccommodation(res, result.data);
}

async function createHotelAccommodation(req: Request, res: Response) {
    const result = createHotelAccommodationSchema.safeParse(req.body);

    if (!result.success) {
        return handleZodError(res, result.error);
    }
    return await service.createHotelAccommodation(res, result.data);
}

function asSingleString(value: unknown): string | undefined {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : undefined;
    return undefined;
}

async function getAllCategoriesInfo(req: Request, res: Response) {
    const eventId = asSingleString((req.params as any).eventId);

    if (!eventId) {
        return response.badRequest(res, "eventId is required");
    }


    const categories = await service.getCategoriesInfo(eventId);

    try {
        return response.successResponse(res, categories);
    } catch (error) {
        response.badRequest(res, error);
    }
}

async function getFacility(req: Request, res: Response) {
    try {
        const categoryId = asSingleString((req.params as any).categoryId);

        if (!categoryId) {
            return response.badRequest(res, "categoryId is required");
        }

        const facilities = await service.getFacilityInfo(categoryId);
        return response.successResponse(res, facilities);
    } catch (error) {
        return response.badRequest(res, error);
    }
}

async function getHotelRooms(req: Request, res: Response) {
    try {
        const facilityId = asSingleString((req.params as any).facilityId);

        if (!facilityId) {
            return response.badRequest(res, "facilityId is required");
        }

        const hotelRooms = await service.getHotelRooms(facilityId);
        return response.successResponse(res, hotelRooms);
    } catch (error) {
        return response.badRequest(res, error);
    }
}

async function getHostelSpacesLeft(req: Request, res: Response) {
    try {
        await service.getHostelSpacesLeft(res);
    } catch {
        return response.badRequest(res, "Failed to get hostel spaces");
    }
}

async function createAccommodationRequest(req: Request, res: Response) {
    const billingService = new BillingService();

    try {
        return await billingService.initializePayment(res, req.body);
    } catch (error) {
        console.log(error);
    }
}

export {
    createFacility,
    createCategories,
    createHostelAccommodation,
    createHotelAccommodation,
    getHostelSpacesLeft,
    getAllCategoriesInfo,
    getFacility,
    getHotelRooms,
    createAccommodationRequest,
};
