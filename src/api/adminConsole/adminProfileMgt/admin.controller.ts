import type {Response} from "express";
import * as service from "./admin.service.js"
import {updateProfile} from "./admin.service.js";
import * as response from "../../ApiResponseContract.js";
import {handleZodError} from "../../exceptions/exceptionsHandler.js";
import type {AuthenticatedAdminUser} from "../../middleware/adminAuth.js";
import {CreateAdminUserSchema, UpdateAdminUserSchema} from "./admin.model.js";
import {badRequest, forbiddenRequest, unauthorizedRequest} from "../../ApiResponseContract.js";


async function getAdminProfile(req: AuthenticatedAdminUser, res: Response) {
    if (!req.adminId)
        return response.unauthorizedRequest(res, "Request not authorized. please try again later");
    console.log("\n-> request: get admin user profile");
    return await service.getAdminProfileInfo(res, req.adminId);
}

async function createAdminProfile(req: AuthenticatedAdminUser, res: Response) {
    console.log("\n-> request: create new admin user")
    const result = CreateAdminUserSchema.safeParse(req.body);
    if (!result.success) return handleZodError(res, result.error);
    return await service.createAdmin(res, result.data);
}

async function updateAdminProfile(req: AuthenticatedAdminUser, res: Response) {
    if (!req.adminId)
        return response.unauthorizedRequest(res, "Request not authorized. please try again later");

    const result = UpdateAdminUserSchema.safeParse(req.body);
    if (!result.success) return handleZodError(res, result.error);

    else if (result.data.email != req.email) {
        console.log("Attempt to update another user's profile")
        return forbiddenRequest(res, "You cannot update another user's account");
    }
    return await updateProfile(res, req.userId, result.data);
}

async function deleteAdminProfile(req: AuthenticatedAdminUser, res: Response) {
    if (!req.adminId)
        return response.unauthorizedRequest(res, "Request not authorized. please try again later");
    return await service.deleteAdmin(res, req.userId);
}


export {
    getAdminsCount,
    getAdminProfile,
    createAdminProfile,
    updateAdminProfile,
    deleteAdminProfile
}