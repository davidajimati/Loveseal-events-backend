import type {Response} from "express";
import {Prisma, PrismaClient} from "@prisma/client"
import * as response from "../../ApiResponseContract.js"

const prisma = new PrismaClient();

export async function getUserProfileInfoForAdmin(res: Response, userId: string, eventId: string) {
    const profileInfo = await prisma.userInformation.findUnique({where: {userId}});
    if (!profileInfo) {
        console.log("user info not found");
        return response.badRequest(res, "Profile not found");
    }
    let amount;
    let paymentStatus;
    const paymentRecord = await prisma.paymentRecords.findFirst({where: {userId, eventId}});
    if (!paymentRecord) {
        console.log("User has no payment record")
        amount = 0;
        paymentStatus = false;
    } else {
        amount = paymentRecord.amount;
        paymentStatus = paymentRecord.paymentStatus;
    }

    const apiResponse = {
        ...profileInfo,
        paymentStatus,
        amount
    };

    return response.successResponse(res, apiResponse);
}