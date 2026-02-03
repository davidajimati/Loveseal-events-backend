import {
    createAccommodationCategorySchema,
    type CreateAccommodationCategoryType,
    type CreateAccommodationFacilityType,
    type CreateHostelAccommodationType,
    type CreateHotelAccommodationType,
} from "../model/accommodation.model.js";
import prisma from "../../../../prisma/Prisma.js";
import * as response from "../../ApiResponseContract.js";
import type {Response} from "express";
import {Prisma} from "@prisma/client";

async function createAccommodationFacility(
    res: Response,
    createFacilityPayload: CreateAccommodationFacilityType,
) {
    try {
        const accomodationFacility = await prisma.accommodationFacilities.create({
            data: {
                eventId: createFacilityPayload.eventId,
                accommodationCategoryId: createFacilityPayload.accommodationCategoryId,
                facilityName: createFacilityPayload.facilityName,
                available: createFacilityPayload.available,
                employedUserPrice: createFacilityPayload.employedUserPrice,
                selfEmployedUserPrice: createFacilityPayload.selfEmployedUserPrice,
                unemployedUserPrice: createFacilityPayload.unemployedUserPrice,
                totalCapacity: createFacilityPayload.totalCapacity,
            },
        });

        return response.successResponse(res, accomodationFacility.facilityId);
    } catch (error) {
        console.log(error);
        response.badRequest(res, "Invalid input");
    }
}

async function createAccommodationCategory(
    res: Response,
    createCategoryPayload: CreateAccommodationCategoryType,
) {
    try {
        const createdCategories = await Promise.all(
            createCategoryPayload.map(category =>
                prisma.accommodationCategory.create({
                    data: {
                        name: category.name,
                    },
                })
            )
        );
        return response.successResponse(res, {
            createdCategories: createdCategories.map(category => ({
                id: category.accommodationCategoryId,
                name: category.name
            })),
        });
    } catch (error: any) {
        console.log(error);

        response.internalServerError(res, error.message);
    }
}

async function createHostelAccommodation(
    res: Response,
    createHostelAccommodationPayload: CreateHostelAccommodationType,
) {
    try {
        const createdAccommodation = await prisma.hostelAccommodation.create({
            data: {
                facilityId: createHostelAccommodationPayload.facilityId,
                roomCode: createHostelAccommodationPayload.roomCode,
                roomIdentifier: createHostelAccommodationPayload.roomIdentifier,
                capacity: createHostelAccommodationPayload.capacity,
                adminReserved: createHostelAccommodationPayload.adminReserved,
                genderRestriction: createHostelAccommodationPayload.genderRestriction,
            },
        });

        return response.successResponse(res, {id: createdAccommodation.roomId});
    } catch (error) {
        console.log(error);
        response.badRequest(res, "Invalid input");
    }
}

async function createHotelAccommodation(
    res: Response,
    createHotelAccommodationPayload: CreateHotelAccommodationType,
) {
    try {
        const createdAccommodation = await prisma.hotelAccommodation.create({
            data: {
                facilityId: createHotelAccommodationPayload.facilityId,
                roomType: createHotelAccommodationPayload.roomType,
                address: createHotelAccommodationPayload.address,
                description: createHotelAccommodationPayload.description,
                available: createHotelAccommodationPayload.available,
                genderRestriction: createHotelAccommodationPayload.genderRestriction,
                adminReserved: createHotelAccommodationPayload.adminReserved,
                price: createHotelAccommodationPayload.price,
                noOfRoomsAvailable: createHotelAccommodationPayload.noOfRoomsAvailable,
            },
        });

        return response.successResponse(res, {id: createdAccommodation.roomTypeId});
    } catch (error) {
        console.log(error);
        response.badRequest(res, error);
    }
}

async function getCategoriesInfo() {
    const allCategoriesInfo = await prisma.accommodationCategory.findMany({
        include: {
            facilityRecord: {
                select: {
                    accommodationCategoryId: true,
                    totalCapacity: true,
                    capacityOccupied: true,
                    facilityName: true,
                },
            },
        },
    });

    const categoriesInfo = allCategoriesInfo.map((item) => {
        const {totalCapacity, capacityOccupied} = item.facilityRecord.reduce(
            (acc, cur) => {
                acc.totalCapacity += cur.totalCapacity;
                acc.capacityOccupied += cur.capacityOccupied;
                return acc;
            },
            {totalCapacity: 0, capacityOccupied: 0},
        );

        return {
            name: item.name,
            categoryId: item.accommodationCategoryId,
            totalCapacity,
            capacityLeft: totalCapacity - capacityOccupied,
        };
    });

    return categoriesInfo;
}

async function getFacilityInfo(categoryId: string) {
    const facilityQuery = await prisma.accommodationFacilities.findMany({
        where: {
            accommodationCategoryId: categoryId,
        },
        select: {
            accommodationCategoryId: true,
            facilityId: true,
            facilityName: true,
            capacityOccupied: true,
            totalCapacity: true,
            selfEmployedUserPrice: true,
            unemployedUserPrice: true,
            employedUserPrice: true,
        },
    });

    const hotelCheck = await prisma.hotelAccommodation.findFirst({
        where: {
            facilityId: {in: facilityQuery.map((item) => item.facilityId)},
        },
    });

    if (hotelCheck) {
        return facilityQuery.map(
            ({
                 selfEmployedUserPrice,
                 unemployedUserPrice,
                 employedUserPrice,
                 ...rest
             }) => rest,
        );
    }

    return facilityQuery;
}

async function getHotelRooms(facilityId: string) {
    const allHotels = await prisma.hotelAccommodation.findMany({
        where: {
            facilityId: facilityId,
        },
    });

    return allHotels;
}

export {
    createAccommodationFacility,
    createAccommodationCategory,
    createHotelAccommodation,
    createHostelAccommodation,
    getCategoriesInfo,
    getFacilityInfo,
    getHotelRooms,
};
