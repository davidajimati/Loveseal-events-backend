import type { Response } from "express";
import * as services from "./user.dashboard.service.js";
import type { AuthenticatedUser } from "../middleware/auth.js";
import { handleZodError } from "../exceptions/exceptionsHandler.js";
import { badRequest, unauthorizedRequest } from "../ApiResponseContract.js";
import {
  dependantSchema,
  bookAccommodationSchema,
  payForDependantSchema,
} from "./user.dashboard.model.js";

function asSingleString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value))
    return typeof value[0] === "string" ? value[0] : undefined;
  return undefined;
}

async function dashboard(req: AuthenticatedUser, res: Response) {
  const userId = req.userId;
  const eventId = asSingleString((req.params as any).eventId);
  if (!userId) {
    console.log("unauthenticated request to fetch dashboard content");
    return unauthorizedRequest(res, "You must be logged in");
  }
  if (!eventId) {
    console.log("Event Id not supplied for dashboard fetch");
    return badRequest(res, "eventId is required");
  }
  return await services.fetchDashboard(res, userId, eventId);
}

async function addDependant(req: AuthenticatedUser, res: Response) {
  const userID = req.userId;

  if (!userID) {
    console.log("unauthenticated request to fetch dashboard content");
    return unauthorizedRequest(res, "You must be logged in");
  }
  const result = dependantSchema.safeParse(req.body);
  if (!result.success) return handleZodError(res, result.error);
  return await services.addDependants(res, result.data);
}

async function removeDependant(req: AuthenticatedUser, res: Response) {
  const userID = req.userId;
  const dependantId = asSingleString((req.params as any).id);
  if (!userID) {
    console.log("unauthenticated request to fetch dashboard content");
    return unauthorizedRequest(res, "You must be logged in");
  } else if (!dependantId) {
    console.log("dependantId not provided for dependant removal request");
    return badRequest(res, "dependantId must be provided");
  }
  return await services.removeDependant(res, dependantId);
}

async function payForDependants(req: AuthenticatedUser, res: Response) {
  const userID = req.userId;
  if (!userID) {
    console.log("unauthenticated request to fetch dashboard content");
    return unauthorizedRequest(res, "You must be logged in");
  }
  const result = payForDependantSchema.safeParse(req.body);
  if (!result.success) return handleZodError(res, result.error);
  return await services.payForDependants(res, userID, result.data);
}

async function bookAccommodation(req: AuthenticatedUser, res: Response) {
  const userID = req.userId;
  if (!userID) {
    console.log("unauthenticated request to fetch dashboard content");
    return unauthorizedRequest(res, "You must be logged in");
  }
  const result = bookAccommodationSchema.safeParse(req.body);
  if (!result.success) return handleZodError(res, result.error);
  return await services.bookAccommodation(res, userID, result.data);
}

export {
  dashboard,
  addDependant,
  bookAccommodation,
  payForDependants,
  removeDependant,
};
