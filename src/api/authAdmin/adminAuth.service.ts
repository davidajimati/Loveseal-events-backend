import type {Response} from "express";
import {randomInt, randomUUID} from "node:crypto";
import jwt, {type JwtPayload} from 'jsonwebtoken';
import {Prisma, PrismaClient} from "@prisma/client";
import * as response from "../ApiResponseContract.js"
import {sendEmailViaSes} from "../emailing/comms.service.js";
import {type otpValidationType} from "../authUser/userAuth.model.js"
import {type adminUserInformationInterface} from "./adminAuth.model.js";

const prisma = new PrismaClient();

async function generateToken(res: Response, email: string) {
    try {
        let adminUser: adminUserInformationInterface | any
        adminUser = await prisma.adminUserRecords.findUnique({where: {email}});
        if (!adminUser) {
            return response.badRequest(res, "Sorry, this action is reserved only for admin users.");
        }

        const SECRET = process.env.ADMIN_JWT_SECRET as string;
        let token: string;
        try {
            token = jwt.sign({id: adminUser.adminUserId, email: adminUser.email}, SECRET, {expiresIn: '1d'});
        } catch (error) {
            console.log("unable to generate new token for adminUser");
            console.error(error);
            throw new Error("token generation failed");
        }

        const {dateCreated, updatedAt, paymentRecords, ...necessaryDetails} = adminUser;
        return response.successResponse(res, {token, userDetails: necessaryDetails});

    } catch (err) {
        console.log("Exception: " + err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2021") {
                return response.internalServerError(res, "login failed. Please try again");
            }
        }
        return response.internalServerError(res, "login failed. Please try again");
    }
}

async function verifyToken(res: Response, token: string) {
    try {
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

    } catch (err) {
        console.log("Exception: " + err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2021") {
                return response.internalServerError(res, "login failed. Please try again");
            }
        }
        return response.internalServerError(res, "something went wrong. Please try again");
    }
}


async function generateOtp(res: Response, email: string, otpReason: string) {
    try {
        const otp = randomInt(111111, 999999).toString();

        const otpReference: string = randomUUID();
        const emailSent = await sendEmailViaSes(email, "Dev test admin login", otp, res);

        if (!emailSent) {
            return response.internalServerError(res, "Error sending OTP. Please try again later");
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
    } catch (err) {
        console.log("Exception: " + err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2021") {
                return response.internalServerError(res, "Otp generation failed. Contact admin");
            }
        }
        return response.internalServerError(res, "something went wrong. Please try again");
    }
}

async function verifyOtp(res: Response, validationPayload: otpValidationType) {
    try {
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
    } catch (err) {
        console.log("Exception: " + err)
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2021") {
                return response.internalServerError(res, "Otp verification failed. Please try again");
            }
        }
        return response.internalServerError(res, "something went wrong.")
    }
}

export {
    verifyToken,
    generateToken,
    generateOtp,
    verifyOtp
}