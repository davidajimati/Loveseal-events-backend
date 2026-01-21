import type {Response} from "express";
import {Prisma, PrismaClient} from "@prisma/client"
import * as response from "../../ApiResponseContract.js"
import type {createAdminPayload} from "@api/adminConsole/adminProfileMgt/admin.model.js";

const prisma = new PrismaClient();

async function getAdminProfileInfo(res: Response, adminId: string) {
    const profile = await prisma.adminUserRecords.findUnique({where: {adminUserId: adminId}});
    if (!profile) {
        console.log(`Admin with adminId ${adminId} not found`);
        return response.notFound(res, "Admin profile does not exist");
    }
    return response.successResponse(res, {profileData: profile});
}

async function createAdmin(res: Response, data: createAdminPayload) {
    try {
        const prismaData = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            ...(data.role !== undefined && {role: data.role}),
            ...(data.userName !== undefined && {userName: data.userName}),
        };
        await prisma.adminUserRecords.create({data: prismaData});
        console.log("user created", prismaData);
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

async function updateProfile(res: Response, userId: string, data: updateUserType) {
    try {
        const prismaData = {
            ...(data.firstName !== undefined && {firstName: data.firstName}),
            ...(data.lastName !== undefined && {lastName: data.lastName}),
            ...(data.emailVerified !== undefined && {emailVerified: data.emailVerified}),
            ...(data.phoneNumber !== undefined && {phoneNumber: data.phoneNumber}),
            ...(data.gender !== undefined && {gender: data.gender}),
            ...(data.country !== undefined && {country: data.country}),
            ...(data.ageRange !== undefined && {ageRange: data.ageRange}),
            ...(data.minister !== undefined && {minister: data.minister}),
            ...(data.localAssembly !== undefined && {localAssembly: data.localAssembly}),
            ...(data.maritalStatus !== undefined && {maritalStatus: data.maritalStatus}),
            ...(data.employmentStatus !== undefined && {employmentStatus: data.employmentStatus}),
            ...(data.stateOfResidence !== undefined && {stateOfResidence: data.stateOfResidence}),
            ...(data.residentialAddress !== undefined && {residentialAddress: data.residentialAddress})
        };

        await prisma.userInformation.update({
            where: {userId},
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

async function deleteUser(res: Response, userId: string) {
    try {
        await prisma.userInformation.delete({where: {userId}});
        return response.successResponse(res, "Profile deleted");
    } catch (error) {
        console.log("Exception: " + error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code == "P2025") {
                return response.badRequest(res, "Inexistent profile Cannot be deleted");
            }
        }
    }
}


export {
    createAdmin,
    deleteUser,
    updateProfile,
    getAdminProfileInfo
}