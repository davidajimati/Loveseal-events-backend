import type {Request, Response} from 'express';
import {emailZod} from "./userAuth.model.js"
import * as response from "../ApiResponseContract.js"
import * as service from "./userAuth.service.js"

async function userLogin(req: Request, res: Response) {
    const token = req.headers.authorization;
    if (token != null) {
        return await service.verifyToken(res, token)
    } else console.log("login error: missing token")
}

async function generateOtp(req: Request, res: Response) {
    const data = emailZod.safeParse(req.body);
    if (!data.success) {
        console.log("otp generation failed: email not supplied or invalid")
        return response.badRequest(res, data.error.format())
    }
}

async function validateOtp(req: Request, res: Response) {
    /**
     * validate otp
     * generate new token
     * return new token + userDetails
     */
}


export {
    userLogin,
    generateOtp,
    validateOtp
}