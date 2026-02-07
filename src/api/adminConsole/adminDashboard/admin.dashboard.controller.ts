import type {AuthenticatedAdminUser} from "../../middleware/adminAuth.js";
import type {Response} from "express";
import * as response from "../../ApiResponseContract.js";
import * as service from "./admin.dashboard.service.js";


export async function getUserProfileForAdmin(req: AuthenticatedAdminUser, res: Response) {
    if (!req.adminId) {
        return response.unauthorizedRequest(res, "Request not authorized. please try again later");
    }
    const {userId, eventId} =  req.body;
    if (!userId || !eventId) {
        console.log("userId and eventId must be supplied");
        return response.badRequest(res, "No userId provided");
    }
    return await service.getUserProfileInfoForAdmin(res, userId, eventId);
}