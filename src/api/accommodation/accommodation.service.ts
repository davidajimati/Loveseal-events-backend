import type { CreateAccommodationFacilityType } from "./accommodation.model.js";
import prisma from "../../../prisma/Prisma.js";
import * as response from "../ApiResponseContract.js";
import type { Response } from "express";

async function createAccommodationFacility(
  res: Response,
  createFacilityPayload: CreateAccommodationFacilityType
) {
  const accomodationFacility = await prisma.accommodationFacilities.create({
    data: {
      eventId: createFacilityPayload.eventId,
      facilityName: createFacilityPayload.facilityName,
      available: createFacilityPayload.available,
      employedUserPrice: createFacilityPayload.employedUserPrice,
      selfEmployedUserPrice: createFacilityPayload.selfEmployedUserPrice,
      unemployedUserPrice: createFacilityPayload.unemployedUserPrice,
      totalCapacity : createFacilityPayload.totalCapacity
    },
  });

  return response.successResponse(res, accomodationFacility.eventId);
}

export { createAccommodationFacility };
