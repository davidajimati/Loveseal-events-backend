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
import cron from "node-cron";

export function mapAccommodationType(
  categoryName?: string,
): AccommodationType | null {
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
          regId: initiateAllocationRequest.registrationId,
        },
      });

      const existingHostelRecord = await prisma.hostelAllocations.findFirst({
        where: {
          registrationId: initiateAllocationRequest.registrationId,
          allocationStatus: "ACTIVE",
          eventId: initiateAllocationRequest.eventId,
        },
      });

      const existingHotelRecord = await prisma.hotelAllocations.findFirst({
        where: {
          registrationId: initiateAllocationRequest.registrationId,
          allocationStatus: "ACTIVE",
          eventId: initiateAllocationRequest.eventId,
        },
      });

      if (existingHostelRecord || existingHotelRecord) {
        throw new Error("User have secured accommodation for this event");
      }

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

      if (!registeredUser) {
        throw new Error("User not registered for this event!");
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

  // private async processHostelAccommodation(
  //   res: any,
  //   registeredUser: any,
  //   facility: accommodationFacilities,
  //   initiateAllocationRequest: InitiateAccommodationAllocationType,
  // ) {
  //   let paymentRequest: InitiatePaymentRequest | null = null;
  //   let allocationId: string;
  //   let roomId: string;
  //
  //   await prisma.$transaction(async (tx) => {
  //     const availableRoom = await tx.$queryRaw<hostelAccommodation[]>`
  //     SELECT *
  //     FROM hostel_accommodation_table
  //     WHERE facilityId = ${facility.facilityId}
  //       AND capacityOccupied < capacity
  //     LIMIT 1
  //     FOR UPDATE
  //   `;
  //
  //
  //     if (availableRoom?.length < 1 || availableRoom[0] == undefined) {
  //       throw new HttpError("Accommodation exhausted", 404);
  //     }
  //
  //     roomId = availableRoom[0].roomId;
  //
  //     const hostelAllocation = await tx.hostelAllocations.create({
  //       data: {
  //         eventId: facility.eventId,
  //         roomId,
  //         paymentReference: this.generatePaymentReference(),
  //         registrationId: registeredUser.regId,
  //         allocator: "ALGORITHM",
  //         allocatedAt: new Date(),
  //         allocationStatus: mapRoomAllocationStatus("PENDING"),
  //       },
  //     });
  //
  //     allocationId = hostelAllocation.id;
  //
  //     const amountToBePaid: any = await this.computeHostelAmountToBePaid(
  //       res,
  //       initiateAllocationRequest.userId,
  //       initiateAllocationRequest.facilityid,
  //     );
  //
  //     await tx.hostelAccommodation.update({
  //       where: { roomId },
  //       data: {
  //         capacityOccupied: { increment: 1 },
  //       },
  //     });
  //
  //     await tx.accommodationFacilities.update({
  //       where: { facilityId: facility.facilityId },
  //       data: {
  //         capacityOccupied: { increment: 1 },
  //       },
  //     });
  //
  //     paymentRequest = {
  //       amount: amountToBePaid,
  //       eventId: initiateAllocationRequest.eventId,
  //       reference: hostelAllocation.paymentReference,
  //       userId: initiateAllocationRequest.userId,
  //       narration: "HOSTEL PAYMENT",
  //     };
  //   });
  //
  //   try {
  //     //@ts-ignore
  //     await this.billingService.initializePayment(res, paymentRequest);
  //   } catch (error) {
  //     await prisma.$transaction(async (tx) => {
  //       await tx.hostelAllocations.update({
  //         where: { id: allocationId },
  //         data: {
  //           allocationStatus: mapRoomAllocationStatus("REVOKED"),
  //         },
  //       });
  //
  //       await tx.hostelAccommodation.update({
  //         where: { roomId },
  //         data: {
  //           capacityOccupied: { decrement: 1 },
  //         },
  //       });
  //
  //       await tx.accommodationFacilities.update({
  //         where: { facilityId: facility.facilityId },
  //         data: {
  //           capacityOccupied: { decrement: 1 },
  //         },
  //       });
  //     });
  //
  //     throw error;
  //   }
  // }

  private async processHostelAccommodation(
    res: Response,
    registeredUser: { regId: string, userId: string },
    facility: accommodationFacilities,
    initiateAllocationRequest: InitiateAccommodationAllocationType,
  ) {
    // Run reservation + allocation atomically.
    // Payment happens AFTER commit. If it fails, compensate.

    const txnResult = await prisma.$transaction(async (tx) => {
      // Lock one available room
      const availableRooms = await tx.$queryRaw<hostelAccommodation[]>`
                SELECT *
                FROM hostel_accommodation_table
                WHERE facilityId = ${facility.facilityId}
                  AND capacityOccupied < capacity AND adminReserved = FALSE
                ORDER BY "capacityOccupied" ASC, "roomId" ASC LIMIT 1
                FOR
                UPDATE
            `;

      const room = availableRooms?.[0];
      if (!room) {
        throw new HttpError("Accommodation exhausted", 404);
      }

      const user = await tx.userInformation.findFirst({
        where: { userId: initiateAllocationRequest.userId },
        select: { employmentStatus: true },
      });

      if (!user) {
        throw new HttpError("User not found", 404);
      }

      // Compute payable amount
      let amountToBePaid: number | string | null | undefined;

      if (user.employmentStatus === "SELF_EMPLOYED") {
        amountToBePaid = facility.selfEmployedUserPrice;
      } else if (user.employmentStatus === "UNEMPLOYED") {
        amountToBePaid = facility.unemployedUserPrice;
      } else {
        amountToBePaid = facility.employedUserPrice;
      }

      if (amountToBePaid == null) {
        throw new HttpError("Accommodation pricing is not configured", 400);
      }

      const paymentReference = this.generatePaymentReference();

      const allocation = await tx.hostelAllocations.create({
        data: {
          eventId: facility.eventId,
          roomId: room.roomId,
          paymentReference,
          registrationId: registeredUser.regId,
          allocator: "ALGORITHM",
          allocatedAt: new Date(),
          allocationStatus: mapRoomAllocationStatus("PENDING"),
        },
      });

      await tx.hostelAccommodation.update({
        where: { roomId: room.roomId },
        data: { capacityOccupied: { increment: 1 } },
      });

      await tx.accommodationFacilities.update({
        where: { facilityId: facility.facilityId },
        data: { capacityOccupied: { increment: 1 } },
      });

      console.log("update accommodation choice to HOSTEL");
      await tx.eventRegistrationTable.update({
        where: {
          regId: registeredUser.regId
        },
        data: {
          accommodationType: "HOSTEL",
          status: "PENDING"
        }
      })

      const paymentRequest: InitiatePaymentRequest = {
        amount: amountToBePaid as any,
        eventId: initiateAllocationRequest.eventId,
        reference: paymentReference,
        userId: initiateAllocationRequest.userId,
        narration: "HOSTEL PAYMENT",
      };

      return {
        allocationId: allocation.id,
        roomId: room.roomId,
        paymentRequest,
      };
    });

    try {
      await this.billingService.initializePayment(
        res,
        txnResult.paymentRequest,
      );
    } catch (error) {
      // Compensation transaction
      await prisma.$transaction(async (tx) => {
        await tx.hostelAllocations.update({
          where: { id: txnResult.allocationId },
          data: { allocationStatus: mapRoomAllocationStatus("REVOKED") },
        });

        await tx.hostelAccommodation.update({
          where: { roomId: txnResult.roomId },
          data: { capacityOccupied: { decrement: 1 } },
        });

        await tx.accommodationFacilities.update({
          where: { facilityId: facility.facilityId },
          data: { capacityOccupied: { decrement: 1 } },
        });
      });

      throw error;
    }
  }

  async revokeExpiredHostelAllocations() {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      console.log("CKECKING HOSTEL ALLOCATIONS");

      return await prisma.$transaction(async (tx) => {
        // 1) Read expired allocations INSIDE the transaction
        const expiredAllocations = await tx.hostelAllocations.findMany({
          where: {
            allocationStatus: "PENDING",
            allocatedAt: { lt: oneHourAgo },
          },
          select: {
            id: true,
            roomId: true,
          },
        });

        if (expiredAllocations.length === 0) return null;

        // 2) Build roomCounts from allocations
        const roomCounts = expiredAllocations.reduce((acc, a) => {
          if (!a.roomId) return acc;
          acc[a.roomId] = (acc[a.roomId] ?? 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const roomIds = Object.keys(roomCounts);
        if (roomIds.length === 0) return null;

        // 3) Fetch all rooms in ONE query (kills N+1)
        const rooms = await tx.hostelAccommodation.findMany({
          where: { roomId: { in: roomIds } },
          select: { roomId: true, facilityId: true },
        });

        const roomToFacility = new Map(rooms.map((r) => [r.roomId, r.facilityId]));

        // 4) Facility counts should be derived from roomCounts
        const facilityCounts = roomIds.reduce((acc, roomId) => {
          const facilityId = roomToFacility.get(roomId);
          if (!facilityId) return acc;
          acc[facilityId] = (acc[facilityId] ?? 0) + (roomCounts[roomId] ?? 0);
          return acc;
        }, {} as Record<string, number>);

        // 5) Revoke allocations (guard ensures idempotence if called twice)
        await tx.hostelAllocations.updateMany({
          where: {
            id: { in: expiredAllocations.map((a) => a.id) },
            allocationStatus: "PENDING",
          },
          data: { allocationStatus: "REVOKED" },
        });

        // 6) Apply decrements (run in parallel inside tx)
        await Promise.all(
            Object.entries(roomCounts).map(([roomId, count]) =>
                tx.hostelAccommodation.update({
                  where: { roomId },
                  data: { capacityOccupied: { decrement: count } },
                }),
            ),
        );

        await Promise.all(
            Object.entries(facilityCounts).map(([facilityId, count]) =>
                tx.accommodationFacilities.update({
                  where: { facilityId },
                  data: { capacityOccupied: { decrement: count } },
                }),
            ),
        );

        return null;
      });
    } catch (error) {
      console.error(
          `[${new Date().toISOString()}] Error revoking allocations:`,
          error,
      );
    }
  }
  async revokeExpiredHotelAllocations() {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      console.log("CKECKING HOTEL ALLOCATIONS");

      const expiredAllocations = await prisma.hotelAllocations.findMany({
        where: {
          allocationStatus: "PENDING",
          allocatedAt: { lt: oneHourAgo },
        },
        select: {
          id: true,
          hotelRoomId: true,
        },
      });

      if (expiredAllocations.length === 0) return null;

      // Count how many allocations per roomTypeId
      const roomCounts = expiredAllocations.reduce((acc, a) => {
        if (a.hotelRoomId) acc[a.hotelRoomId] = (acc[a.hotelRoomId] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const roomTypeIds = Object.keys(roomCounts);
      if (roomTypeIds.length === 0) return null;

      // Fetch room -> facility mapping in ONE query (no N+1)
      const rooms = await prisma.hotelAccommodation.findMany({
        where: { roomTypeId: { in: roomTypeIds } },
        select: { roomTypeId: true, facilityId: true },
      });

      const roomToFacility = new Map<string, string>();
      for (const r of rooms) roomToFacility.set(r.roomTypeId, r.facilityId);

      // Facility counts derived from roomCounts * mapping
      const facilityCounts: Record<string, number> = {};
      for (const [roomTypeId, count] of Object.entries(roomCounts)) {
        const facilityId = roomToFacility.get(roomTypeId);
        if (!facilityId) continue; // skip if mapping missing
        facilityCounts[facilityId] = (facilityCounts[facilityId] ?? 0) + count;
      }

      const allocationIds = expiredAllocations.map((a) => a.id);

      await prisma.$transaction(async (tx) => {
        // 1. Revoke allocations (idempotent-ish safety: keep status filter)
        await tx.hotelAllocations.updateMany({
          where: {
            id: { in: allocationIds },
            allocationStatus: "PENDING",
          },
          data: { allocationStatus: "REVOKED" },
        });

        // 2. Update rooms (parallel inside the transaction)
        await Promise.all(
            Object.entries(roomCounts).map(([roomTypeId, count]) =>
                tx.hotelAccommodation.update({
                  where: { roomTypeId },
                  data: { noOfRoomsOccupied: { decrement: count } },
                }),
            ),
        );

        // 3. Update facilities (parallel inside the transaction)
        await Promise.all(
            Object.entries(facilityCounts).map(([facilityId, count]) =>
                tx.accommodationFacilities.update({
                  where: { facilityId },
                  data: { capacityOccupied: { decrement: count } },
                }),
            ),
        );
      });

      return null;
    } catch (error) {
      console.error(
          `[${new Date().toISOString()}] Error revoking allocations:`,
          error,
      );
    }
  }
  startAllocationCronJob() {
    const task = cron.schedule("*/5 * * * *", async () => {
      try {
        await this.revokeExpiredHostelAllocations();
        await this.revokeExpiredHotelAllocations();
      } catch (error) {}
    });

    return task;
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
