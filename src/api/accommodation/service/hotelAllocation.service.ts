import type {
  InitiateAccommodationAllocationType,
  InitiateHotelAllocationType,
} from "../model/allocation.model.js";
import prisma from "../../../../prisma/Prisma.js";
import type { Response } from "express";
import {
  type accommodationFacilities,
  type hotelAccommodation,
  Prisma,
} from "@prisma/client";
import crypto from "crypto";
import { HttpError } from "../../exceptions/HttpError.js";
import { BillingService } from "../../billing/service/billing.service.js";
import type { InitiatePaymentRequest } from "../../billing/model/billing.model.js";
import * as response from "../../ApiResponseContract.js";
import {
  mapAccommodationType,
  mapRoomAllocationStatus,
} from "./allocation.service.js";

export class HotelAllocationService {
  private readonly billingService: BillingService;

  constructor() {
    this.billingService = new BillingService();
  }

  async initiateHotelAllocation(
    res: Response,
    initiateHotelAllocationRequest: InitiateHotelAllocationType,
  ) {
    try {
      let registeredUser = await prisma.eventRegistrationTable.findFirst({
        where: {
          regId: initiateHotelAllocationRequest.registrationId,
        },
      });

      const facility = await prisma.accommodationFacilities.findFirst({
        where: {
          facilityId: initiateHotelAllocationRequest.facilityId,
        },
        include: {
          categoryRecord: true,
        },
      });

        const existingHostelRecord = await prisma.hostelAllocations.findFirst({
              where: {
                registrationId: initiateHotelAllocationRequest.registrationId,
                allocationStatus: "ACTIVE",
                eventId: initiateHotelAllocationRequest.eventId,
              },
            });
      
            const existingHotelRecord = await prisma.hotelAllocations.findFirst({
              where: {
                registrationId: initiateHotelAllocationRequest.registrationId,
                allocationStatus: "ACTIVE",
                eventId: initiateHotelAllocationRequest.eventId,
              },
            });
      
            if (existingHostelRecord || existingHotelRecord) {
              throw new Error("User have secured accommodation for this event");
            }
      

      if (facility == null) {
        throw new HttpError("Facility not found", 404);
      }
      const accType = mapAccommodationType(facility?.categoryRecord.name);

      if (!registeredUser) {
        throw new Error("User not registered for this event!");
      }

      if (facility?.categoryRecord.name == "HOTEL") {
        await this.processHotelAccommodation(
          res,
          registeredUser,
          facility,
          initiateHotelAllocationRequest,
        );
      } else {
        throw new HttpError("Bad request", 400);
      }
    } catch (error: any) {
      console.log(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return response.badRequest(
          res,
          error?.meta ? error?.meta.message : "Prisma client error",
        );
      }

      return response.badRequest(res, error?.message);
    }
  }

  private async processHotelAccommodation(
    res: any,
    registeredUser: any,
    facility: accommodationFacilities,
    initiateHotelAllocationRequest: InitiateHotelAllocationType,
  ) {
    let paymentRequest: InitiatePaymentRequest | null = null;
    let allocationId: string;
    let roomId: string;

    await prisma.$transaction(async (tx) => {
      const availableRoom = await tx.$queryRaw<hotelAccommodation[]>`
      SELECT *
      FROM hotel_accommodation_table
      WHERE roomTypeId = ${initiateHotelAllocationRequest.roomTypeId}
        AND noOfRoomsOccupied < noOfRoomsAvailable
      LIMIT 1
      FOR UPDATE
    `;

  

      if (availableRoom.length < 1 || availableRoom[0] == undefined) {
        throw new HttpError("Accommodation exhausted", 404);
      }

      const hotelAllocation = await tx.hotelAllocations.create({
        data: {
          hotelRoomId: availableRoom[0].roomTypeId,
          registrationId: registeredUser.regId,
          eventId: initiateHotelAllocationRequest.eventId,
          allocationStatus: "PENDING",
          allocator: "ALGORITHM",
          paymentReference: this.generatePaymentReference(),
          allocatedAt: new Date(),
        },
      });

      allocationId = hotelAllocation.id;

      await tx.hotelAccommodation.update({
        where: { roomTypeId: hotelAllocation.hotelRoomId },
        data: {
          noOfRoomsOccupied: { increment: 1 },
        },
      });

      await tx.accommodationFacilities.update({
        where: { facilityId: initiateHotelAllocationRequest.facilityId },
        data: {
          capacityOccupied: { increment: 1 },
        },
      });

      await tx.eventRegistrationTable.update({
        where: {
          regId: registeredUser.regId
        },
        data: {
          accommodationType: "HOSTEL",
          status: "PENDING"
        }
      })

      paymentRequest = {
        //@ts-ignore
        amount: availableRoom[0].price,
        eventId: initiateHotelAllocationRequest.eventId,
        reference: hotelAllocation.paymentReference,
        userId: initiateHotelAllocationRequest.userId,
        narration: "HOTEL PAYMENT",
      };
    });

    try {
      //@ts-ignore
      await this.billingService.initializePayment(res, paymentRequest);
    } catch (error) {
      await prisma.$transaction(async (tx) => {
        await tx.hotelAllocations.update({
          where: { id: allocationId },
          data: {
            allocationStatus: mapRoomAllocationStatus("REVOKED"),
          },
        });

        await tx.hotelAccommodation.update({
          where: { roomTypeId: initiateHotelAllocationRequest.roomTypeId },
          data: {
            noOfRoomsOccupied: { decrement: 1 },
          },
        });

        await tx.accommodationFacilities.update({
          where: { facilityId: initiateHotelAllocationRequest.facilityId },
          data: {
            capacityOccupied: { decrement: 1 },
          },
        });
      });

      throw error;
    }
  }

  private generatePaymentReference() {
    const randomString = crypto.randomBytes(4).toString("hex").toUpperCase();

    const timestamp = Date.now();

    return `PAY-${timestamp}-${randomString}`;
  }
}
