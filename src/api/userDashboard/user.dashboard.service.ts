import {PrismaClient, Prisma} from '@prisma/client';
import {type Response} from "express";
import type {
    dependantType,
    bookAccommodationType,
    payForDependantType, dashboardInterface
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


async function fetchDashboard(res: Response, userId: string, eventId: string) {
    try {
        // Fetch core records in parallel
        const [user, event, regRecord, paymentRecord] = await Promise.all([
            prisma.userInformation.findUnique({where: {userId}}),
            prisma.eventInformation.findUnique({where: {eventId}}),
            prisma.eventRegistrationTable.findFirst({where: {userId, eventId}}),
            prisma.paymentRecords.findFirst({where: {userId, eventId}}),
        ]);

        if (!user) {
            console.log(`record for user ${userId} not found.`);
            return response.badRequest(res, "Create an account to begin");
        }

        if (!event) {
            console.log(`event ${eventId} not found.`);
            return response.badRequest(res, "Cannot get dashboard content for an inexistent event");
        }

        if (!regRecord) {
            console.log(`Registration record for user ${userId} not found.`);
            return response.badRequest(res, "You're not registered for this event");
        }

        const paymentSuccessful = paymentRecord?.paymentStatus === "SUCCESSFUL";

        const dependants = await prisma.dependantInfoTable.findMany({
            where: {parentRegId: userId, eventId},
            select: {id: true, name: true, age: true, gender: true},
            orderBy: {dateCreated: "desc"},
        });

        const mealTicket = regRecord.participationMode === "CAMPER" && regRecord.registrationCompleted === true && paymentSuccessful;

        const dashboard: dashboardInterface = {
            userId,
            regId: regRecord.regId,
            firstName: user.firstName ?? "",
            attendanceType: regRecord.participationMode,
            mealTicket,
            eventData: {
                eventId,
                eventTitle: event.eventName,
                date: event.startDate,
                ...(event.venue != null && {venue: event.venue}),
            },
            accommodation: {
                requiresAccommodation: (regRecord.accommodationType ?? "NONE") !== "NONE",
                paidForAccommodation: paymentSuccessful,
                ...(((paymentRecord?.amount !== undefined && paymentSuccessful) ? {amountPaidForAccommodation: paymentRecord.amount} : {amountPaidForAccommodation: 0})),
                ...(regRecord.accommodationType != null && {accommodationType: regRecord.accommodationType.toString()}),
                room: regRecord.accommodationDetails,
                accommodationImageUrl: "",
            },
            dependants: {
                dependantCount: dependants.length,
                dependantsData: dependants.map(d => ({
                    dependantId: d.id,
                    dependantName: d.name,
                    dependantAge: d.age,
                    dependantGender: d.gender
                })),
            },
        };

        return response.successResponse(res, dashboard);
    } catch (err) {
        console.log("Error occurred fetching dashboard", err);
        return response.internalServerError(res, "Error occurred fetching dashboard. please try again");
    }
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
 * add semilore's work the following two endpoints
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