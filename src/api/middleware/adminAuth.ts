import type {Request, Response} from 'express';
import {verifyToken} from "../authAdmin/adminAuth.service.js";
import {unauthorizedRequest} from "../ApiResponseContract.js";

export default async function adminLogin(req: Request, res: Response) {
    const token = req.headers.authorization;
    if (token != null) {
        return await verifyToken(res, token)
    } else {
        console.log("login error: missing token")
        return unauthorizedRequest(res, "missing or invalid token")
    }
}