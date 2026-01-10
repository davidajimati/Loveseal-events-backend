import type {Response} from "express";
import prisma from "../../../prisma/Prisma.js";
import {randomInt, randomUUID} from "node:crypto";
import jwt, {type JwtPayload} from 'jsonwebtoken';
import * as response from "../ApiResponseContract.js"
import {sendOtpByEmail} from "../emailing/comms.service.js";
import {type otpValidationType} from "../authUser/userAuth.model.js"
import {type adminUserInformationInterface} from "./adminAuth.model.js";


async function generateToken(res: Response, email: string) {
    let adminUser: adminUserInformationInterface | any
    adminUser = await prisma.adminUserRecords.findUnique({where: {email}});
    if (!adminUser) {
        return response.badRequest(res, "Sorry, this action is reserved only for admin users.");
    }

    const SECRET = process.env.ADMIN_JWT_SECRET as string;
    let token: string;
    try {
        token = jwt.sign({id: adminUser.id, email: adminUser.email}, SECRET, {expiresIn: '1d'});
    } catch (error) {
        console.log("unable to generate new token for adminUser");
        console.error(error);
        throw new Error("token generation failed");
    }
    const {dateCreated, updatedAt, paymentRecords, ...necessaryDetails} = adminUser;
    return response.successResponse(res, {token, userDetails: necessaryDetails});
}

async function verifyToken(res: Response, token: string) {
    const SECRET = process.env.ADMIN_JWT_SECRET as string;
    let adminUser: adminUserInformationInterface | any;

    let decoded: JwtPayload;
    try {
        decoded = jwt.verify(token, SECRET) as JwtPayload;
    } catch (error) {
        console.log("error validating admin token: ", error);
        return response.unauthorizedRequest(res, "Invalid or Expired token. Please login again");
    }

    if (!decoded.id) {
        return response.unauthorizedRequest(res, "Invalid or Expired token");
    }
    adminUser = await prisma.adminUserRecords.findUnique({where: {adminUserId: decoded.id}});
    const {dateCreated, updatedAt, paymentRecords, ...necessaryDetails} = adminUser;
    return response.successResponse(res, {token, userDetails: necessaryDetails});
}


async function generateOtp(res: Response, email: string, otpReason: string) {
    const otp = randomInt(99999999, 11111111).toString();
    const otpReference: string = randomUUID();

    const emailSendResponse = await sendOtpByEmail(email, otp);
    if (!emailSendResponse) {
        return response.serviceUnavailable(res, "Error sending otp. Please try again.");
    }

    const otpResponse = {
        reference: otpReference
    }
    await prisma.otpLogTable.create({
        data: {
            otp: otp,
            otpReference: otpReference,
            email: email,
            otpReason: otpReason
        }
    });

    return response.successResponse(res, otpResponse);
}

async function verifyOtp(res: Response, validationPayload: otpValidationType) {
    const otpRecord = await prisma.otpLogTable.findFirst({
        where: {
            email: validationPayload.email,
            otpReference: validationPayload.otpReference
        }
    });

    if (!otpRecord) {
        return response.badRequest(res, "OTP does not exist. Generate an otp to continue");
    } else if (validationPayload.otp !== otpRecord.otp) {
        return response.badRequest(res, "Invalid OTP supplied.")
    }

    await prisma.otpLogTable.update({
        where: {id: otpRecord.id},
        data: {
            otpUsed: true,
            timeUsed: new Date(),
        }
    })
}

export {
    verifyToken,
    generateToken,
    generateOtp,
    verifyOtp
}