import type { InitiateAccommodationAllocationType } from "../model/allocation.model.js";
import prisma from "../../../../prisma/Prisma.js";
import type { Response } from "express";
import {
  type accommodationFacilities,
  type hostelAccommodation,
  Prisma,
} from "@prisma/client";
import crypto from "crypto";
import { HttpError } from "../../exceptions/HttpError.js";
import { BillingService } from "../../billing/service/billing.service.js";
import type { InitiatePaymentRequest } from "../../billing/model/billing.model.js";
import * as response from "../../ApiResponseContract.js";
import { AccommodationType } from "../../../common/constants.js";
import { roomAllocationStatus } from "@prisma/client";

export function mapAccommodationType(categoryName?: string): AccommodationType | null {
  switch (categoryName) {
    case "HOTEL":
      return AccommodationType.HOTEL;
    case "HOSTEL":
      return AccommodationType.HOSTEL;
    default:
      return null;
  }
}

export function mapRoomAllocationStatus(status?: string): roomAllocationStatus {
  switch (status) {
    case "ACTIVE":
      return "ACTIVE";
    case "REVOKED":
      return "REVOKED";
    case "PENDING":
    default:
      return "PENDING";
  }
}

export class AllocationService {
  private readonly billingService: BillingService;

  constructor() {
    this.billingService = new BillingService();
  }

  async initiateHostelAllocation(
    res: Response,
    initiateAllocationRequest: InitiateAccommodationAllocationType,
  ) {
    try {
      let registeredUser = await prisma.eventRegistrationTable.findFirst({
        where: {
          eventId: initiateAllocationRequest.eventId,
          userId: initiateAllocationRequest.userId,
        },
      });

      const facility = await prisma.accommodationFacilities.findFirst({
        where: {
          facilityId: initiateAllocationRequest.facilityid,
        },
        include: {
          categoryRecord: true,
        },
      });

      if (facility == null) {
        throw new HttpError("Facility not found", 404);
      }
      const accType = mapAccommodationType(facility?.categoryRecord.name);

      if (!registeredUser && facility) {
        registeredUser = await prisma.eventRegistrationTable.create({
          data: {
            userId: initiateAllocationRequest.userId,
            accommodationAssigned: false,
            accommodationDetails: "",
            eventId: initiateAllocationRequest.eventId,
            participationMode: "CAMPER",
            accommodationType: accType,
            intiator: "USER",
          },
        });
      }

      if (facility?.categoryRecord.name == "HOSTEL") {
        await this.processHostelAccommodation(
          res,
          registeredUser,
          facility,
          initiateAllocationRequest,
        );
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



  
  private async processHostelAccommodation(
    res: any,
    registeredUser: any,
    facility: accommodationFacilities,
    initiateAllocationRequest: InitiateAccommodationAllocationType,
  ) {
    let paymentRequest: InitiatePaymentRequest | null = null;
    let allocationId: string;
    let roomId: string;

    await prisma.$transaction(async (tx) => {
      const availableRoom = await tx.$queryRaw<hostelAccommodation[]>`
      SELECT *
      FROM hostel_accommodation_table
      WHERE facilityId = ${facility.facilityId}
        AND capacityOccupied < capacity
      LIMIT 1
      FOR UPDATE
    `;

      if (!registeredUser) {
        throw new HttpError("Unable to locate or register user", 400);
      }

      if (availableRoom?.length < 1 || availableRoom[0] == undefined) {
        throw new HttpError("Accommodation exhausted", 404);
      }

      roomId = availableRoom[0].roomId;

      const hostelAllocation = await tx.hostelAllocations.create({
        data: {
          eventId: facility.eventId,
          roomId,
          paymentReference: this.generatePaymentReference(),
          registrationId: registeredUser.regId,
          allocator: "ALGORITHM",
          allocatedAt: new Date(),
          allocationStatus: mapRoomAllocationStatus("PENDING_PAYMENT"),
        },
      });

      allocationId = hostelAllocation.id;

      const amountToBePaid: any = await this.computeHostelAmountToBePaid(
        res,
        initiateAllocationRequest.userId,
        initiateAllocationRequest.facilityid,
      );

      await tx.hostelAccommodation.update({
        where: { roomId },
        data: {
          capacityOccupied: { increment: 1 },
        },
      });

      await tx.accommodationFacilities.update({
        where: { facilityId: facility.facilityId },
        data: {
          capacityOccupied: { increment: 1 },
        },
      });

      paymentRequest = {
        amount: amountToBePaid,
        eventId: initiateAllocationRequest.eventId,
        reference: hostelAllocation.paymentReference,
        userId: initiateAllocationRequest.userId,
        narration: "HOSTEL PAYMENT",
      };
    });

    try {
      //@ts-ignore
      await this.billingService.initializePayment(res, paymentRequest);
    } catch (error) {
      await prisma.$transaction(async (tx) => {
        await tx.hostelAllocations.update({
          where: { id: allocationId },
          data: {
            allocationStatus: mapRoomAllocationStatus("REVOKED"),
          },
        });

        await tx.hostelAccommodation.update({
          where: { roomId },
          data: {
            capacityOccupied: { decrement: 1 },
          },
        });

        await tx.accommodationFacilities.update({
          where: { facilityId: facility.facilityId },
          data: {
            capacityOccupied: { decrement: 1 },
          },
        });
      });

      throw error;
    }
  }

  private async computeHostelAmountToBePaid(
    res: any,
    userId: string,
    facilityId: string,
  ) {
    try {
      const user = await prisma.userInformation.findFirst({
        where: {
          userId: userId,
        },
      });
      const facility = await prisma.accommodationFacilities.findFirst({
        where: {
          facilityId: facilityId,
        },
      });

      if (user?.employmentStatus == "SELF_EMPLOYED") {
        return facility?.selfEmployedUserPrice;
      } else if (user?.employmentStatus == "UNEMPLOYED") {
        return facility?.unemployedUserPrice;
      } else {
        return facility?.employedUserPrice;
      }
    } catch (error: any) {
      return response.notFound(res, error.message);
    }
  }

  private generatePaymentReference() {
    const randomString = crypto.randomBytes(4).toString("hex").toUpperCase();

    const timestamp = Date.now();

    return `PAY-${timestamp}-${randomString}`;
  }
}
