import type {
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  KoraPayInitiatePaymentResponse,
  KorapPayInitiatePaymentRequest,
} from "./billing.model.js";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
dotenv.config();

import prisma from "@prisma/Prisma.js";

import * as response from "../ApiResponseContract.js";
import type { Response } from "express";
import { HttpError } from "../exceptions/HttpError.js";

export class BillingService {
  async initializePayment(res: Response, req: InitiatePaymentRequest) {
    try {
      const paymentRequest: any = await this.mapKoraPayRequest(res, req);

      const thirdPartyResponse = await this.hitThirdPartyEndpoint(
        res,
        paymentRequest
      );

      await this.populateTable(req);
      return this.mapPaymentResponse(res, thirdPartyResponse);
    } catch (error: any) {
      return response.badRequest(res, error.message || error);
    }
  }

  async populateTable(paymentRequest: InitiatePaymentRequest) {
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

  mapPaymentResponse(
    res: Response,
    koraPayResponse: KoraPayInitiatePaymentResponse
  ) {
    const paymentResponse: InitiatePaymentResponse = {
      checkoutUrl: koraPayResponse?.data.checkout_url,
      reference: koraPayResponse?.data?.reference,
    };

    return response.successResponse(res, paymentResponse);
  }

  async hitThirdPartyEndpoint(
    res: Response,
    paymentRequest: InitiatePaymentRequest
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
        }
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

  async mapKoraPayRequest(
    res: Response,
    paymentRequest: InitiatePaymentRequest
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
      notification_url: "http://localhost:8080/webhook",
      redirect_url: "https://wothsmflx.org",
      reference: paymentRequest.reference,
    };

    return korapayRequest;
  }
}
