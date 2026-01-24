import {PrismaClient, Prisma} from '@prisma/client';
import type {AuthenticatedUser} from "../middleware/auth.js";
import {type Response} from "express";
import type {
    dependantType,
    bookAccommodationType,
    payForDependantType
} from "./user.dashboard.model.js";
import * as response from "../ApiResponseContract.js";
import {gender} from "@prisma/client";

function mapGender(gender: string): gender {
    switch (gender) {
        case "MALE":
            return "MALE";
        case 'FEMALE':
            return "FEMALE";
        default:
            return "MALE";
    }
}

const prisma = new PrismaClient();


async function fetchDashboard(res: Response, userId: string) {


}

async function addDependants(res: Response, userId: string, data: dependantType) {
    try {
        const gender = mapGender(data.gender);
        const prismaData = {
            name: data.name,
            age: data.age,
            gender: gender,
            parentRegId: userId,
            eventId: data.eventId

        }

        await prisma.dependantInfoTable.create({
            data: prismaData
        })
        return response.successResponse(res, "Dependants added successfully.");
    } catch (err) {
        console.log("Error occurred creating a dependency")
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2021") {
                return response.internalServerError(res, "operation failed. Please contact admin");
            }
        }
        return response.internalServerError(res, "Error occurred adding a dependant. please try again");
    }
}

async function removeDependant(res: Response, dependantId: string) {
    try {
        await prisma.dependantInfoTable.delete({where: {id: dependantId}});
        return response.successResponse(res, "dependant removed");
    } catch (error) {
        console.log("Exception: " + error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code == "P2025") {
                return response.badRequest(res, "Inexistent dependant Cannot be removed");
            }
        }
    }
}

/**
 * @semilore will pick up the following two endpoints
 */
async function bookAccommodation(res: Response, userId: string, data: bookAccommodationType) {

}

async function payForDependants(res: Response, userId: string, data: payForDependantType) {

}


export {
    fetchDashboard,
    addDependants,
    removeDependant,
    bookAccommodation,
    payForDependants
}