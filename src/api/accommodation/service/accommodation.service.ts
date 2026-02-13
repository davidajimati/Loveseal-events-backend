import {
  createAccommodationCategorySchema,
  type CreateAccommodationCategoryType,
  type CreateAccommodationFacilityType,
  type CreateHostelAccommodationType,
  type CreateHotelAccommodationType,
} from "../model/accommodation.model.js";
import * as response from "../../ApiResponseContract.js";
import type { Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    return response.successResponse(res, { id: createdAccommodation.roomId });
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
    const { totalCapacity, capacityOccupied } = item.facilityRecord.reduce(
      (acc, cur) => {
        acc.totalCapacity += cur.totalCapacity;
        acc.capacityOccupied += cur.capacityOccupied;
        return acc;
      },
      { totalCapacity: 0, capacityOccupied: 0 },
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

  // If there are no facilities, return early
  if (facilityQuery.length === 0) return facilityQuery;

  // Fetch all hotel accommodations for these facilities in ONE query (avoid N+1)
  const facilityIds = facilityQuery.map((f) => f.facilityId);
  const hotelFacilities = await prisma.hotelAccommodation.findMany({
    where: {
      facilityId: {
        in: facilityIds,
      },
    },
    select: {
      facilityId: true,
    },
  });

  // Build a set of facilityIds that have at least one hotel room
  const hotelFacilityIdSet = new Set(hotelFacilities.map((h) => h.facilityId));

  // Only strip the price fields for facilities that have hotel accommodation records
  return facilityQuery.map((f) => {
    if (!hotelFacilityIdSet.has(f.facilityId)) return f;

    const {
      selfEmployedUserPrice,
      unemployedUserPrice,
      employedUserPrice,
      ...rest
    } = f;

    return rest;
  });
}

async function getAllEventsFacility(eventId: string, categoryId?: string) {
  const facilityQuery = await prisma.accommodationFacilities.findMany({
    where: {
      eventId: eventId,
      ...(categoryId && { accommodationCategoryId: categoryId }),
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
      eventRecord: {
        select: {
          eventName: true,
          startDate: true,
          endDate: true,
        },
      },
      categoryRecord: {
        select: {
          name: true,
        },
      },
    },
  });

  return facilityQuery;
}

async function getHotelRooms(facilityId: string) {
  const id = (facilityId ?? "").trim();
  if (!id) {
    throw new Error("facilityId is required");
  }
  const allHotels = await prisma.hotelAccommodation.findMany({
    where: {
      facilityId: id
    }
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
  getAllEventsFacility,
  getHotelRooms,
  getHostelSpacesLeft,
};
