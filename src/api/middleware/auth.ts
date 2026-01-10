import jwt, {type JwtPayload} from "jsonwebtoken";
import * as response from "../ApiResponseContract.js";
import type {NextFunction, Request, Response} from 'express';
import {unauthorizedRequest} from "../ApiResponseContract.js";
import type {userInformationInterface} from "../authUser/userAuth.model.js";

export interface AuthenticatedUser extends Request {
    userId?: string,
    email?: string,
}

export default async function userLogin(req: AuthenticatedUser, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token != null) {

        const SECRET = process.env.JWT_SECRET as string;

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, SECRET) as JwtPayload;
        } catch (error) {
            console.log("error validating token: ", error);
            return response.unauthorizedRequest(res, "Invalid or Expired token. Please login again");
        }

        if (!decoded.id) {
            return response.unauthorizedRequest(res, "Invalid or Expired token");
        }

        req.userId = decoded.id;
        req.email = decoded.email;
        next();

    } else {
        console.log("login error: missing token")
        return unauthorizedRequest(res, "missing or invalid token")
    }
}