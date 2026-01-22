import type {Request, Response} from 'express'
import * as services from "./user.dashboard.service.js";
import type {AuthenticatedUser} from "@api/middleware/auth.js";
import {handleZodError} from "@api/exceptions/exceptionsHandler.js";
import {badRequest, unauthorizedRequest} from "@api/ApiResponseContract.js";
import {
    dependantSchema,
    bookAccommodationSchema,
    payForDependantSchema
} from "@api/userDashboard/user.dashboard.model.js";


async function dashboard(req: AuthenticatedUser, res: Response) {
    await confirmAuth(req, res);
    return await services.fetchDashboard(res, req.userId);
}

async function addDependant(req: AuthenticatedUser, res: Response) {
    await confirmAuth(req, res);
    const result = dependantSchema.safeParse(req.body);
    if (!result.success) return handleZodError(res, result.error);
    return await services.addDependants(res, req.userId, result.data);
}

async function payForDependants(req: AuthenticatedUser, res: Response) {
    await confirmAuth(req, res);
    const result = bookAccommodationSchema.safeParse(req.body);
    if (!result.success) return handleZodError(res, result.error);

}

async function bookAccommodation(req: AuthenticatedUser, res: Response) {
    await confirmAuth(req, res);
    const result = bookAccommodationSchema.safeParse(req.body);
    if (!result.success) return handleZodError(res, result.error);
    return await service.bookAccommodation(res, req.userId, result.data);
}

async function confirmAuth(req: AuthenticatedUser, res: Response) {
    if (!req.userId) {
        console.log("unauthenticated request to fetch dashboard content")
        return unauthorizedRequest(res, "You must be logged in")
    }
}

export {
    dashboard,
    addDependant,
    bookAccommodation,
    payForDependants
}