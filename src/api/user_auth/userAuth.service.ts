import jwt, {type JwtPayload} from 'jsonwebtoken';
import prisma from "../../../prisma/Prisma.js";
import * as response from "../ApiResponseContract.js"
import type {Request, Response} from "express";
import {email} from "zod";

async function generateToken(res: Response, email: string) {
    const user = await prisma.user_information.findUnique({where: {email}});
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

    return response.successResponse(res, {token, userDetails: user});
}

async function verifyToken(res: Response, token: string) {
    const SECRET = process.env.JWT_SECRET as string;

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

    const user =  await prisma.user_information.findUnique({where: {id: decoded.id}});


}

export {
    verifyToken
}