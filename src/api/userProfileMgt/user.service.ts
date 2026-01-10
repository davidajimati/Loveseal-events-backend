import type {Response} from "express";
import prisma from "../../../prisma/Prisma.js"
import * as response from "../ApiResponseContract.js"
import type {createUserType, updateUserType} from "./user.model.js";


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
    return response.successResponse(res, "Profile created");
}

async function updateProfile(res: Response, userId: string, data: updateUserType) {

    const prismaData = {
        ...(data.firstName !== undefined && {firstName: data.firstName}),
        ...(data.lastName !== undefined && {lastName: data.lastName}),
        ...(data.phoneNumber !== undefined && {phoneNumber: data.phoneNumber}),
        ...(data.gender !== undefined && {gender: data.gender}),
        ...(data.ageRange !== undefined && {ageRange: data.ageRange}),
        ...(data.emailVerified !== undefined && {emailVerified: data.emailVerified}),
        ...(data.localAssembly !== undefined && {localAssembly: data.localAssembly}),
        ...(data.maritalStatus !== undefined && {maritalStatus: data.maritalStatus}),
        ...(data.employmentStatus !== undefined && {employmentStatus: data.employmentStatus}),
    }

    await prisma.userInformation.update({
        where: {userId},
        data: prismaData
    });
    return response.successResponse(res, "Profile updated");
}

async function deleteUser(res: Response, userId: string) {
    await prisma.userInformation.delete({where: {userId}});
    return response.successResponse(res, "Profile deleted");
}


export {
    createUser,
    deleteUser,
    updateProfile,
    getAUsersCount,
    getUserProfileInfo
}