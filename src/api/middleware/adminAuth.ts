import jwt, {type JwtPayload} from "jsonwebtoken";
import * as response from "../ApiResponseContract.js";
import type {NextFunction, Request, Response} from 'express';
import {unauthorizedRequest} from "../ApiResponseContract.js";


export interface AuthenticatedAdminUser extends Request {
    adminId?: string
    email?: string
}

export default async function adminLogin(req: AuthenticatedAdminUser, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token != null) {

        const SECRET = process.env.ADMIN_JWT_SECRET as string;

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

        req.adminId = decoded.id;
        req.email = decoded.email;
        next();

    } else {
        console.log("login error: missing token")
        return unauthorizedRequest(res, "missing or invalid token")
    }
}