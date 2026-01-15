import jwt, {type JwtPayload} from "jsonwebtoken";
import * as response from "../ApiResponseContract.js";
import type {NextFunction, Request, Response} from 'express';
import {unauthorizedRequest} from "../ApiResponseContract.js";

export interface AuthenticatedUser extends Request {
    userId?: string,
    email?: string,
}

export default async function userLogin(req: AuthenticatedUser, res: Response, next: NextFunction) {
    let token = req.headers.authorization;
    if (token != null) {
        token = token.replace("Bearer ", "");
        const SECRET = process.env.JWT_SECRET as string;

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, SECRET) as JwtPayload;
        } catch (error) {
            console.log("error validating token: ", error);
            return response.unauthorizedRequest(res, "Invalid or Expired token. Please login again");
        }

        if (!decoded.userId) {
            return response.unauthorizedRequest(res, "Invalid or Expired token");
        }

        req.userId = decoded.userId;
        req.email = decoded.email;
        next();

    } else {
        console.log("login error: missing token")
        return unauthorizedRequest(res, "missing or invalid token")
    }
}