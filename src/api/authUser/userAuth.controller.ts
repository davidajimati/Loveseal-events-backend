import prisma from "../../../prisma/Prisma.js";
import * as service from "./userAuth.service.js";
import { type Request, type Response } from "express";
import { badRequest } from "../ApiResponseContract.js";
import { unauthorizedRequest } from "../ApiResponseContract.js";
import { handleZodError } from "../exceptions/exceptionsHandler.js";
import { generateOtpSchema, validateOtpSchema } from "./userAuth.model.js";
import * as response from "../ApiResponseContract.js";

async function userLogin(req: Request, res: Response) {
  let token = req.headers.authorization;
  if (token != null) {
    token = token?.replace("Bearer ", "");
    return await service.verifyToken(res, token);
  } else {
    console.log("login error: missing token");
    return unauthorizedRequest(res, "missing or invalid token");
  }
}

async function generateTokenForRegistrant(req: Request, res: Response) {
  const email = req.body.email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return badRequest(res, "a valid email is required");
  }
  return service.getOtpForRegistrant(res, email);
}

async function generateOtp(req: Request, res: Response) {
  const data = generateOtpSchema.safeParse(req.body);
  if (!data.success) {
    console.log("otp generation failed: email not supplied or invalid");
    return handleZodError(res, data.error);
  }
  const user = await prisma.userInformation.findUnique({
    where: { email: data.data.email },
  });
  if (!user || !user.email) {
    return badRequest(
      res,
      "You do not have a profile. create one to continue.",
    );
  }
  await service.generateOtp(res, data.data.email, "Login");
}

async function validateOtp(req: Request, res: Response) {
  try {
    const result = validateOtpSchema.safeParse(req.body);
    if (!result.success) {
      return handleZodError(res, result.error);
    }
    await service.verifyOtp(res, result.data);
    return await service.generateToken(res, result.data.email);
  } catch (error) {
    console.log("VALIDATE OTP ERROR", error);
    response.internalServerError(res, "An error occurred generating otp");
  }
}

export { userLogin, generateOtp, validateOtp, generateTokenForRegistrant };
