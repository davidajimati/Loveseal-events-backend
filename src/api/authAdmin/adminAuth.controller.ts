import type {Request, Response} from 'express';
import prisma from "../../../prisma/Prisma.js";
import * as service from "./adminAuth.service.js"
import {handleZodError} from "../exceptions/exceptionsHandler.js";
import {unauthorizedRequest} from "../ApiResponseContract.js";
import {generateOtpSchema, validateOtpSchema} from "../authUser/userAuth.model.js"


async function generateOtp(req: Request, res: Response) {
    const data = generateOtpSchema.safeParse(req.body);
    if (!data.success) {
        console.log("otp generation failed: email not supplied or invalid")
        return handleZodError(res, data.error)
    }
    const adminUser = await prisma.adminUserRecords.findUnique({where: {email: data.data.email}})
    if (!adminUser || !adminUser.email) {
        return unauthorizedRequest(res, "Sorry, this action is reserved only for admin users.")
    }
    await service.generateOtp(res, data.data.email, "Login")
}

async function validateOtp(req: Request, res: Response) {
    const result = validateOtpSchema.safeParse(req.body);
    if (!result.success) {
        return handleZodError(res, result.error);
    }
    await service.verifyOtp(res, result.data);
    return await service.generateToken(res, result.data.email);
}


export {
    generateOtp,
    validateOtp
}