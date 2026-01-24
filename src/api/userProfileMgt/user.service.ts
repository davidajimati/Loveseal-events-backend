import type {Response} from "express";
import {Prisma, PrismaClient} from "@prisma/client"
import * as response from "../ApiResponseContract.js"
import type {createUserType, updateUserType} from "./user.model.js";

const prisma = new PrismaClient();

async function getAUsersCount(res: Response) {
    const userCount = await prisma.userInformation.count();
    return response.successResponse(res, {userCount});
}

async function getUserProfileInfo(res: Response, userId: string) {
    const profileInfo = await prisma.userInformation.findUnique({where: {userId}});
    if (!profileInfo) {
        console.log("user info not found");
        return response.badRequest(res, "Profile not found");
    }
    return response.successResponse(res, {profileInfo});
}

async function createUser(res: Response, data: createUserType) {
    try {
        const prismaData = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            gender: data.gender,

            ...(data.ageRange !== undefined && {ageRange: data.ageRange}),
            ...(data.localAssembly !== undefined && {localAssembly: data.localAssembly}),
            ...(data.maritalStatus !== undefined && {maritalStatus: data.maritalStatus}),
            ...(data.employmentStatus !== undefined && {employmentStatus: data.employmentStatus}),
        };
        await prisma.userInformation.create({data: prismaData});
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
    createUser,
    deleteUser,
    updateProfile,
    getAUsersCount,
    getUserProfileInfo
}