import {
    type CreateAccommodationCategoryType,
    type CreateAccommodationFacilityType,
    type CreateHostelAccommodationType,
    type CreateHotelAccommodationType,
    type getFacilityType,
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
            createCategoryPayload.categories.map((category) =>
                prisma.accommodationCategory.create({
                    data: {
                        eventId: createCategoryPayload.eventId,
                        name: category.name,
                    },
                }),
            ),
        );
        return response.successResponse(res, {
            createdCategories: createdCategories.map((category) => ({
                id: category.accommodationCategoryId,
                name: category.name,
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
                adminReserved: createHotelAccommodationPayload.adminReserved,
                price: createHotelAccommodationPayload.price,
                noOfRoomsAvailable: createHotelAccommodationPayload.noOfRoomsAvailable,
            },
        });

        return response.successResponse(res, {
            id: createdAccommodation.roomTypeId,
        });
    } catch (error) {
        console.log(error);
        response.badRequest(res, error);
    }
}

export async function getAllEventsFacility(eventId: string, categoryId?: string) {
    const facilityQuery = await prisma.accommodationFacilities.findMany({
        where: {
            eventId: eventId,
            ...(categoryId && {accommodationCategoryId: categoryId}),
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

    return facilityQuery;
}

async function getHostelSpacesLeft(res: Response) {
    try {
        const allHostels = await prisma.accommodationCategory.findMany({
            where: {
                name: "HOSTEL",
            },
        });

        if (allHostels.length < 1) {
            throw new Error("Invalid category");
        }

        const aggregates = await prisma.accommodationFacilities.aggregate({
            where: {
                accommodationCategoryId: {
                    in: allHostels.map((item) => item.accommodationCategoryId),
                },
                eventRecord: {
                    eventStatus: "ACTIVE",
                },
            },
            _sum: {
                capacityOccupied: true,
                totalCapacity: true,
            },
        });

        const occupied = aggregates._sum.capacityOccupied ?? 0;
        const total = aggregates._sum.totalCapacity ?? 0;

        response.successResponse(res, {
            capacityLeft: total - occupied,
        });
    } catch (error) {
        response.badRequest(res, error);
    }
}

async function getCategoriesInfo(eventId: string) {
    const allCategoriesInfo = await prisma.accommodationCategory.findMany({
        where: {
            eventId: eventId,
        },
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

async function getFacilityInfo(res: Response, categoryId: string) {
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
        facilityQuery.map(
            ({
                 selfEmployedUserPrice,
                 unemployedUserPrice,
                 employedUserPrice,
                 ...rest
             }) => rest,
        );
    }
    return response.successResponse(res, facilityQuery);
}


type FacilityRow = {
    accommodationCategoryId: string;
    facilityId: string;
    facilityName: string;
    capacityOccupied: number;
    totalCapacity: number;
    selfEmployedUserPrice: number | null
    unemployedUserPrice: number | null;
    employedUserPrice: number | null;
};


async function getHostelFacilityInfo(res: Response, data: getFacilityType) {
    const categoryId = (data.categoryId ?? "").trim();
    if (!categoryId) return response.badRequest(res, "categoryId is required");

    const facilityQuery = await prisma.$queryRaw<FacilityRow[]>(
        Prisma.sql`
            SELECT accommodationCategoryId,
                   facilityId,
                   facilityName,
                   capacityOccupied,
                   totalCapacity,
                   selfEmployedUserPrice,
                   unemployedUserPrice,
                   employedUserPrice
            FROM accomodation_facilities
            WHERE accommodationCategoryId = ${categoryId}
              AND totalCapacity > capacityOccupied`,
    );

    if (facilityQuery.length === 0) {
        return response.successResponse(res, []);
    }

    const facilityIds = facilityQuery.map((f) => f.facilityId);

    const hostelInfos = await prisma.hostelAccommodation.findMany({
        where: {facilityId: {in: facilityIds}},
        select: {
            facilityId: true,
            genderRestriction: true,
            teenagersRoom: true,
            capacity: true,
            capacityOccupied: true
        },
    });

    const hostelInfoByFacilityId = new Map(
        hostelInfos.map((h) => [h.facilityId, h]),
    );

    const isTeenagerRange = data.ageRange === "13-19";
    const requestedGender = data.gender;

    type Totals = { totalCapacity: number; totalOccupied: number };

    const totalsByFacilityId = new Map<string, Totals>();

    for (const h of hostelInfos) {
        const isTeenRoom = h.teenagersRoom === true;

        // If gender doesn't match, skip
        if (h.genderRestriction !== requestedGender) continue;

        // If age range does NOT match the room reservation type,
        // explicitly store zero totals for that facility
        if (isTeenagerRange !== isTeenRoom) {
            totalsByFacilityId.set(h.facilityId, {
                totalCapacity: 0,
                totalOccupied: 0,
            });
            continue;
        }

        const current = totalsByFacilityId.get(h.facilityId) ?? {
            totalCapacity: 0,
            totalOccupied: 0,
        };

        current.totalCapacity += h.capacity ?? 0;
        current.totalOccupied += h.capacityOccupied ?? 0;

        totalsByFacilityId.set(h.facilityId, current);
    }

    const responseList = facilityQuery
        .map((facility) => {
            const totals = totalsByFacilityId.get(facility.facilityId);
            if (!totals) return null;

            return {
                ...facility,
                totalCapacity: totals.totalCapacity,
                capacityOccupied: totals.totalOccupied,
            };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);
    return response.successResponse(res, responseList);
}


async function getHotelRooms(facilityId: string) {
    const allHotels = await prisma.hotelAccommodation.findMany({
        where: {
            facilityId: facilityId,
        },
    });

    return allHotels;
}

export async function getHostels(facilityId: string) {
    const allHostels = await prisma.hostelAccommodation.findMany({
        where: {
            facilityId: facilityId,
        },
    });
    return allHostels;
}

export {
    createAccommodationFacility,
    createAccommodationCategory,
    createHotelAccommodation,
    createHostelAccommodation,
    getHostelFacilityInfo,
    getCategoriesInfo,
    getFacilityInfo,
    getHotelRooms,
    getHostelSpacesLeft,
};
