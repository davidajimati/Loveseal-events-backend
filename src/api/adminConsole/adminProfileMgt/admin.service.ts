import type {Response} from "express";
import {Prisma, PrismaClient} from "@prisma/client"
import * as response from "../../ApiResponseContract.js"
import type {updateAdminType, createAdminType} from "./admin.model.js";

const prisma = new PrismaClient();

async function getAdminProfileInfo(res: Response, adminId: string) {
    const profile = await prisma.adminUserRecords.findUnique({where: {adminUserId: adminId}});
    if (!profile) {
        console.log(`Admin with adminId ${adminId} not found`);
        return response.notFound(res, "Admin profile does not exist");
    }
    return response.successResponse(res, {profileData: profile});
}

async function createAdmin(res: Response, payload: createAdminType) {
    try {
        const prismaData = {
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            role: payload.role,
            ...(payload.userName !== undefined && {userName: payload.userName}),
        };

        await prisma.adminUserRecords.create({data: prismaData});
        console.log("admin profile created", prismaData);
        return response.successResponse(res, "Profile created");

    } catch (error) {
        console.log("Exception: " + error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.log("PrismaClientKnownRequestError")
            if (error.code == "P2002") {
                return response.badRequest(res, "A user with same info already exists");
            }
        } else return response.internalServerError(res, "something went wrong");
    }
}

async function updateProfile(res: Response, adminUserId: string, data: updateAdminType) {
    try {
        const prismaData = {
            ...(data.firstName !== undefined && {firstName: data.firstName}),
            ...(data.lastName !== undefined && {lastName: data.lastName}),
            ...(data.role !== undefined && {role: data.role}),
            ...(data.userName !== undefined && {userName: data.userName}),

        };

        await prisma.adminUserRecords.update({
            where: {adminUserId},
            data: prismaData
        });
        return response.successResponse(res, "Profile updated");
    } catch (error) {
        console.log("Exception: " + error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return response.internalServerError(res, "Something went wrong. Please try again.");
        } else return response.internalServerError(res, "something went wrong");
    }
}

async function deleteAdminUser(res: Response, adminUserId: string) {
    try {
        await prisma.adminUserRecords.delete({where: {adminUserId}});
        return response.successResponse(res, "Profile deleted");
    } catch (error) {
        console.log("Exception: " + error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code == "P2025") {
                return response.badRequest(res, "Inexistent admin profile cannot be deleted");
            }
        }
    }
}


export {
    createAdmin,
    deleteAdminUser,
    updateProfile,
    getAdminProfileInfo
}