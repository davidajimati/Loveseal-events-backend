import type {Request, Response} from 'express';
import {generateOtpSchema, validateOtpSchema} from "./userAuth.model.js"
import * as response from "../ApiResponseContract.js"
import * as service from "./userAuth.service.js"
import {handleZodError} from "../exceptions/exceptionsHandler.js";

async function userLogin(req: Request, res: Response) {
    const token = req.headers.authorization;
    if (token != null) {
        return await service.verifyToken(res, token)
    } else {
        console.log("login error: missing token")
        return response.unauthorizedRequest(res, "missing or invalid token")
    }
}

async function generateOtp(req: Request, res: Response) {
    const data = generateOtpSchema.safeParse(req.body);
    if (!data.success) {
        console.log("otp generation failed: email not supplied or invalid")
        return handleZodError(res, data.error)
    }
}

async function validateOtp(req: Request, res: Response) {
    const result = validateOtpSchema.safeParse(req.body);
    if (!result.success) {
        return handleZodError(res, result.error);
    }
    /**
     * validate otp
     * generate new token
     * return new token + userDetails
     */
    service.generateToken(res, result.data.email);

}


export {
    userLogin,
    generateOtp,
    validateOtp
}