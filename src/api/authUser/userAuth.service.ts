import jwt, { type JwtPayload } from "jsonwebtoken";
import * as response from "../ApiResponseContract.js";
import type { Response } from "express";
import {
  type otpValidationType,
  type userInformationInterface,
} from "./userAuth.model.js";
import { randomInt, randomUUID } from "node:crypto";
import { Prisma, PrismaClient } from "@prisma/client";
import { EmailingService } from "../emailing/brevo/notification.service.js";
import type {
  HtmlNotifyRequest,
  TextNotifyRequest,
} from "../emailing/model/notification.model.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlContent = fs.readFileSync(
  path.join(__dirname, "../../static/templates/otp.html"),
  "utf8",
);



async function getOtpForRegistrant(res: Response, email: string) {
  const user = await prisma.userInformation.findFirst({ where: { email } });
  if (!user) {
    const newUser = await prisma.userInformation.create({ data: { email } });
    if (!newUser) {
      console.log("new user creation failed");
      return response.internalServerError(res, "Error generating OTP");
    }
    return generateOtp(res, email, "registration");
  } else {
    return generateOtp(res, email, "login");
  }
}

const prisma = new PrismaClient();

async function generateToken(res: Response, email: string) {
  try {
    let user: userInformationInterface | any;
    user = await prisma.userInformation.findUnique({ where: { email } });
    if (!user) {
      return response.badRequest(
        res,
        "Profile does not exist. Register to continue",
      );
    }

    const SECRET = process.env.JWT_SECRET as string;
    let token: string;
    try {
      token = jwt.sign({ email: user.email, userId: user.userId }, SECRET, {
        expiresIn: "7d",
      });
    } catch (error) {
      console.log("unable to generate new token for user");
      console.error(error);
      throw new Error("token generation failed");
    }
    const { eventRegistrations, paymentRecords, ...necessaryDetails } = user;
    return response.successResponse(res, {
      token,
      userDetails: necessaryDetails,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2021") {
        return response.internalServerError(
          res,
          "operation failed. Please contact admin",
        );
      }
    }
    return response.internalServerError(res, "something went wrong");
  }
}

async function verifyToken(res: Response, token: string) {
  try {
    const SECRET = process.env.JWT_SECRET as string;
    let user: userInformationInterface | any;

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, SECRET) as JwtPayload;
    } catch (error) {
      console.log("error validating token: ", error);
      return response.unauthorizedRequest(
        res,
        "Invalid or Expired token. Please login again",
      );
    }

    if (!decoded.userId) {
      return response.unauthorizedRequest(res, "Invalid or Expired token");
    }
    user = await prisma.userInformation.findUnique({
      where: { userId: decoded.userId },
    });
    if (!user) {
      return response.badRequest(res, "Create an account to continue");
    }
    const { eventRegistrations, paymentRecords, ...necessaryDetails } = user;
    return response.successResponse(res, {
      token,
      userDetails: necessaryDetails,
    });
  } catch (err) {
    console.log("Exception: " + err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2021") {
        return response.internalServerError(
          res,
          "Invalid or Expired token. Please try again",
        );
      }
    }
    return response.internalServerError(res, "something went wrong");
  }
}

async function generateOtp(res: Response, email: string, otpReason: string) {
  try {
    const otp = randomInt(111111, 999999).toString();
    const otpReference: string = randomUUID();

    const emailService = new EmailingService();

    // const emailData: TextNotifyRequest = {
    //   email: email,
    //   subject: "EMAIL CONFIRMATION",
    //   textContent: `Your Confirmation OTP is ${otp}`,
    // };

    const emailData: HtmlNotifyRequest = {
      email: email,
      subject: "EMAIL CONFIRMATION",
      params: {
        loginDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        userName: "User",
        otpCode: `${otp}`,
      },
      htmlContent: htmlContent,
    };

    const emailSent = await emailService.sendHtmlContent(res, emailData);

    if (!emailSent) {
      return response.internalServerError(
        res,
        "Error sending OTP. Please try again later",
      );
    }

    const otpResponse = {
      reference: otpReference,
    };
    await prisma.otpLogTable.create({
      data: {
        otp: otp,
        otpReference: otpReference,
        email: email,
        otpReason: otpReason,
      },
    });

    return response.successResponse(res, otpResponse);
  } catch (err) {
    console.log("Exception: " + err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2021") {
        return response.internalServerError(
          res,
          "Otp generation failed. Contact admin",
        );
      }
    }
    return response.internalServerError(res, "something went wrong");
  }
}

async function verifyOtp(res: Response, validationPayload: otpValidationType) {
  try {
    const otpRecord = await prisma.otpLogTable.findFirst({
      where: {
        email: validationPayload.email,
        otpReference: validationPayload.otpReference,
      },
    });

    if (!otpRecord) {
      return response.badRequest(
        res,
        "OTP does not exist. Generate an otp to continue",
      );
    }
    if (validationPayload.otp !== otpRecord.otp) {
      return response.badRequest(res, "Invalid OTP supplied.");
    }

    await prisma.otpLogTable.update({
      where: { id: otpRecord.id },
      data: {
        otpUsed: true,
        timeUsed: new Date(),
      },
    });
  } catch (err) {
    console.log("Exception: " + err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2021") {
        return response.internalServerError(
          res,
          "Operation failed. Contact admin",
        );
      }
    }
    return response.internalServerError(res, "something went wrong");
  }
}

export {
  verifyToken,
  generateToken,
  generateOtp,
  verifyOtp,
  getOtpForRegistrant,
};
