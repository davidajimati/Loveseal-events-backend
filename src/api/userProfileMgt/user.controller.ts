import type {Response} from "express";
import * as service from "./user.service.js"
import * as response from "../ApiResponseContract.js";
import type {AuthenticatedUser} from "../middleware/auth.js"
import type {AuthenticatedAdminUser} from "../middleware/adminAuth.js";
import {createUserSchema, updateUserSchema} from "./user.model.js";
import {handleZodError} from "../exceptions/exceptionsHandler.js";
import {updateProfile} from "./user.service.js";


async function getUsersCount(req: AuthenticatedAdminUser, res: Response) {
    if (!req.adminId) {
        return response.unauthorizedRequest(res, "Request not authorized. please try again later");
    }
    return await service.getAUsersCount(res);
}

async function getUserProfile(req: AuthenticatedUser, res: Response) {
    if (!req.userId) {
        return response.unauthorizedRequest(res, "Request not authorized. please try again later");
    }
    return await service.getUserProfileInfo(res, req.userId);
}

async function createUserProfile(req: AuthenticatedUser, res: Response) {
    if (!req.userId)
        return response.unauthorizedRequest(res, "Request not authorized. please try again later");

    const result = createUserSchema.safeParse(req.body);
    if (!result.success) return handleZodError(res, result.error);

    return await service.createUser(res, result.data);
}

async function updateUserProfile(req: AuthenticatedUser, res: Response) {
    if (!req.userId)
        return response.unauthorizedRequest(res, "Request not authorized. please try again later");

    const result = updateUserSchema.safeParse(req.body);
    if (!result.success) return handleZodError(res, result.error);
    return await updateProfile(res, req.userId, result.data);
}

async function deleteUserProfile(req: AuthenticatedUser, res: Response) {
    if (!req.userId)
        return response.unauthorizedRequest(res, "Request not authorized. please try again later");
    return await service.deleteUser(res, req.userId);
}


export {
    getUsersCount,
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile
}