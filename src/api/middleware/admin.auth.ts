import type {NextFunction, Request, Response} from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export interface adminAuthResponse extends Request {
    adminUserId?: String;
}