import type {
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  KoraPayInitiatePaymentResponse,
  KorapPayInitiatePaymentRequest,
  PaymentStatusWebhook,
} from "../model/billing.model.js";
import dotenv from "dotenv";

dotenv.config();

import prisma from "../../../../prisma/Prisma.js";

import * as response from "../../ApiResponseContract.js";
import type { Response } from "express";
import { HttpError } from "../../exceptions/HttpError.js";
import type { hostelAccommodation } from "@prisma/client";

export class BillingService {
  async initializePayment(res: Response, req: InitiatePaymentRequest) {
    try {
      const paymentRequest: any = await this.mapKoraPayRequest(res, req);

      const thirdPartyResponse = await this.hitThirdPartyEndpoint(
        res,
        paymentRequest,
      );

      await this.populateTable(req);
      return this.mapPaymentResponse(res, thirdPartyResponse);
    } catch (error: any) {
      return response.badRequest(res, error.message || error);
    }
  }

  async verifyPayment(res: Response, req: PaymentStatusWebhook) {
    const hostelAllocation = await prisma.hostelAllocations.findFirst({
      where: {
        paymentReference: req.data.reference,
      },
    });

    const hotelAllocation = await prisma.hotelAllocations.findFirst({
      where: {
        paymentReference: req.data.reference,
      },
      include: {
        hotelRoomRecord: true,
      },
    });

    const dependent = await prisma.dependantInfoTable.findFirst({
      where: {
        paymentReference: req.data.reference,
      },
    });

    try {
      const newStatus = req.data.status === "success" ? "SUCCESSFUL" : "FAILED";

      if (req.data.status === "success") {
        if (hostelAllocation != null) {
          await prisma.hostelAllocations.update({
            where: {
              paymentReference: req.data.reference,
            },
            data: {
              allocationStatus: "ACTIVE",
            },
          });

          const roomAllocated = await prisma.hostelAccommodation.findFirst({
            where: {
              roomId: hostelAllocation.roomId,
            },
            include: {
              facilityRecord: true,
            },
          });

          const accommodationDetails = {
            roomCode: roomAllocated?.roomCode,
            roomIdentifier: roomAllocated?.roomIdentifier,
            facilityName: roomAllocated?.facilityRecord.facilityName,
          };

          await prisma.eventRegistrationTable.update({
            where: {
              regId: hostelAllocation.registrationId,
            },
            data: {
              accommodationAssigned: true,
              status: "CONFIRMED",
              accommodationDetails: JSON.stringify(accommodationDetails),
            },
          });
        }

        if (dependent != null) {
          await prisma.dependantInfoTable.update({
            where: {
              paymentReference: req.data.reference,
            },
            data: {
              paymentStatus: "SUCCESSFUL",
            },
          });
        }

        if (hotelAllocation != null) {
          await prisma.hotelAllocations.update({
            where: {
              paymentReference: req.data.reference,
            },
            data: {
              allocationStatus: "ACTIVE",
            },
          });

          const roomAllocated = await prisma.hotelAccommodation.findFirst({
            where: {
              roomTypeId: hotelAllocation.hotelRoomId,
            },
            include: {
              facilityRecord: true,
            },
          });

          const accommodationDetails = {
            roomCode: roomAllocated?.roomType,
            address: roomAllocated?.address,
            facilityName: roomAllocated?.facilityRecord.facilityName,
            price: roomAllocated?.price,
          };

          await prisma.eventRegistrationTable.update({
            where: {
              regId: hotelAllocation.registrationId,
            },
            data: {
              accommodationAssigned: true,
              status: "CONFIRMED",
              accommodationDetails: JSON.stringify(accommodationDetails),
            },
          });
        }
      } else {
        if (hostelAllocation != null) {
          const hostel = await prisma.hostelAllocations.update({
            where: {
              paymentReference: req.data.reference,
            },
            data: {
              allocationStatus: "REVOKED",
            },
          });
          const revokedAccommodation = await prisma.hostelAccommodation.update({
            where: { roomId: hostel.roomId },
            data: {
              capacityOccupied: { decrement: 1 },
            },
          });

          await prisma.accommodationFacilities.update({
            where: { facilityId: revokedAccommodation.facilityId },
            data: {
              capacityOccupied: { decrement: 1 },
            },
          });
        }

        if (hotelAllocation != null) {
          const hotel = await prisma.hotelAllocations.update({
            where: {
              paymentReference: req.data.reference,
            },
            data: {
              allocationStatus: "REVOKED",
            },
          });
          const revokedAccommodation = await prisma.hotelAccommodation.update({
            where: { roomTypeId: hotel.hotelRoomId },
            data: {
              noOfRoomsOccupied: { decrement: 1 },
            },
          });

          await prisma.accommodationFacilities.update({
            where: { facilityId: revokedAccommodation.facilityId },
            data: {
              capacityOccupied: { decrement: 1 },
            },
          });
        }
      }

      const transaction = await prisma.paymentRecords.findFirst({
        where: {
          paymentReference: req.data.reference,
        },
      });

      if (transaction == null) {
        throw new HttpError("Invalid transaction reference", 404);
      }

      await prisma.paymentRecords.update({
        where: {
          paymentReference: req.data.reference,
        },
        data: {
          paymentStatus: newStatus,
          providerRawResponse: JSON.parse(JSON.stringify(req)),
        },
      });

      return response.successResponse(res, "Successful");
    } catch (error: any) {
      console.log(error);
      if (error instanceof HttpError) {
        throw error;
      }
      response.badRequest(res, error.message);
    }
  }

  private async populateTable(paymentRequest: InitiatePaymentRequest) {
    await prisma.paymentRecords.create({
      data: {
        amount: paymentRequest.amount,
        eventId: paymentRequest.eventId,
        paymentReference: paymentRequest.reference,
        userId: paymentRequest.userId,
        paymentReason: paymentRequest?.narration
          ? paymentRequest?.narration
          : "narration",
        currencyCode: "NGN",
      },
    });
  }

  private mapPaymentResponse(
    res: Response,
    koraPayResponse: KoraPayInitiatePaymentResponse,
  ) {
    const paymentResponse: InitiatePaymentResponse = {
      checkoutUrl: koraPayResponse?.data.checkout_url,
      reference: koraPayResponse?.data?.reference,
    };

    return response.successResponse(res, paymentResponse);
  }

  private async hitThirdPartyEndpoint(
    res: Response,
    paymentRequest: InitiatePaymentRequest,
  ) {
    try {
      const response = await fetch(
        `${process.env.KORAPAY_BASE_URL}/charges/initialize`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.KORAPAY_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentRequest),
        },
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Korapay API error: ${response.status} - ${text}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("INITIALIZE ERROR ", error);
      throw new HttpError("internal Server error", 500);
    }
  }

  private async mapKoraPayRequest(
    res: Response,
    paymentRequest: InitiatePaymentRequest,
  ) {
    const userInformation = await prisma.userInformation.findFirst({
      where: {
        userId: paymentRequest.userId,
      },
    });

    const eventInformation = await prisma.eventInformation.findFirst({
      where: {
        eventId: paymentRequest.eventId,
      },
    });

    if (userInformation == null || eventInformation == null) {
      response.notFound(res, "Invalid details");
    }

    const korapayRequest: KorapPayInitiatePaymentRequest = {
      amount: paymentRequest.amount,
      currency: "NGN",
      customer: {
        email: userInformation?.email,
        name: `${userInformation?.firstName} ${userInformation?.lastName}`,
      },
      merchant_bears_cost: false,
      narration: paymentRequest.narration,
      notification_url:
        `${process.env.API_URL}/billing/verify`,
      redirect_url: `${process.env.CLIENT_BASE_URL}/dashboard`,
      reference: paymentRequest.reference,
    };

    return korapayRequest;
  }
}
