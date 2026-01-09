import jwt, {type JwtPayload} from 'jsonwebtoken';
import prisma from "../../../prisma/Prisma.js";
import * as response from "../ApiResponseContract.js"
import type {Response} from "express";
import {type userInformationInterface} from "./userAuth.model.js";
import {randomInt, randomUUID} from "node:crypto";


async function generateToken(res: Response, email: string) {
    let user: userInformationInterface | any
    user = await prisma.user_information.findUnique({where: {email}});
    if (!user) {
        return response.badRequest(res, "Profile does not exist. Register to continue");
    }

    const SECRET = process.env.JWT_SECRET as string;
    let token: string;
    try {
        token = jwt.sign({id: user.id, email: user.email}, SECRET, {expiresIn: '7d'});
    } catch (error) {
        console.log("unable to generate new token for user");
        console.error(error);
        throw new Error("token generation failed");
    }
    const {eventRegistrations, paymentRecords, ...necessaryDetails} = user;
    return response.successResponse(res, {token, userDetails: necessaryDetails});
}

async function verifyToken(res: Response, token: string) {
    const SECRET = process.env.JWT_SECRET as string;
    let user: userInformationInterface | any;

    let decoded: JwtPayload;
    try {
        decoded = jwt.verify(token, SECRET) as JwtPayload;
    } catch (error) {
        console.log("error validating token: ", error);
        return response.unauthorizedRequest(res, "Invalid or Expired token");
    }

    if (!decoded.id) {
        return response.unauthorizedRequest(res, "Invalid or Expired token");
    }
    user = await prisma.user_information.findUnique({where: {id: decoded.id}});
    const {eventRegistrations, paymentRecords, ...necessaryDetails} = user;
    return response.successResponse(res, {token, userDetails: necessaryDetails});
}


async function generateOtp(res: Response, email: string) {
    const otpReference = randomInt(999999, 111111)
    const token = randomUUID();

    const otpResponse = {
        reference: otpReference
    }


}

async function verifyOtp(res: Response, token: string) {

}

export {
    verifyToken,
    generateToken,
    generateOtp,
    verifyOtp
}