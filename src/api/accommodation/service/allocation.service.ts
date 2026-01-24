import { EventRegistrationService } from "@/api/events/service/event-registration.service.js";
import type { InitiateAccommodationAllocationType } from "../model/allocation.model.js";
import prisma from "@prisma/Prisma.js";
import type { Response } from "express";
import {
  Prisma,
  type accommodationFacilities,
  type eventRegistrationTable,
  type hostelAccommodation,
} from "@prisma/client";
import crypto from "crypto";
import { HttpError } from "@/api/exceptions/HttpError.js";
import { BillingService } from "@/api/billing/service/billing.service.js";
import type { InitiatePaymentRequest } from "@/api/billing/model/billing.model.js";
import * as response from "../../ApiResponseContract.js";

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
      let registeredUser = await prisma.eventRegistrationTable.findUnique({
        where: {
          eventId_userId: {
            eventId: initiateAllocationRequest.eventId,
            userId: initiateAllocationRequest.userId,
          },
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

      if (!registeredUser && facility) {
        registeredUser = await prisma.eventRegistrationTable.create({
          data: {
            userId: initiateAllocationRequest.userId,
            accommodationAssigned: false,
            accommodationDetails: "",
            eventId: initiateAllocationRequest.eventId,
            participationMode: "CAMPER",
            accommodationType: facility?.categoryRecord?.name,
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

      return response.badRequest(res, error);
    }
  }

//Add transaction to this function

  private async processHostelAccommodation(
    res: any,
    registeredUser: any,
    facility: accommodationFacilities,
    initiateAllocationRequest: InitiateAccommodationAllocationType,
  ) {
    const availableRoom = await prisma.$queryRaw<
      hostelAccommodation[]
    >`SELECT * 
   FROM hostel_accommodation_table
   WHERE facilityId = ${facility.facilityId} 
     AND capacityOccupied < capacity
   LIMIT 1`;

    if (!registeredUser) {
      throw new HttpError("Unable to locate or reguster user", 400);
    }
    if (availableRoom.length < 1 || availableRoom[0] == undefined) {
      throw new HttpError("accomodation exhausted", 404);
    }

    const hostelAllocation = await prisma.hostelAllocations.create({
      data: {
        eventId: facility?.eventId,
        roomId: availableRoom[0].roomId,
        paymentReference: this.generatePaymentReference(),
        registrationId: registeredUser.regId,
        allocator: "ALGORITHM",
        allocatedAt: new Date(),
        allocationStatus: "PENDING",
      },
    });

    const amountToBePaid: any = await this.computeHostelAmountToBePaid(
      res,
      initiateAllocationRequest.userId,
      initiateAllocationRequest.facilityid,
    );

    const initializePaymentRequest: InitiatePaymentRequest = {
      amount: amountToBePaid,
      eventId: initiateAllocationRequest.eventId,
      reference: hostelAllocation?.paymentReference,
      userId: initiateAllocationRequest?.userId,
      narration: "HOSTEL PAYMENT",
    };

    await prisma.hostelAccommodation.update({
      where: {
        roomId: availableRoom[0].roomId,
      },
      data: {
        capacityOccupied: availableRoom[0].capacityOccupied + 1,
      },
    });

    await prisma.accommodationFacilities.update({
      where: {
        facilityId: facility.facilityId,
      },
      data: {
        capacityOccupied: facility.capacityOccupied + 1,
      },
    });

    this.billingService.initializePayment(res, initializePaymentRequest);
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
