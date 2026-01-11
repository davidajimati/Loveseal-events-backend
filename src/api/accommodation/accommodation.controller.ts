import type { Request, Response } from "express";
import { handleZodError } from "../exceptions/exceptionsHandler.js";
import { createAccommodationFacilitySchema } from "./accommodation.model.js";
import * as service from "./accommodation.service.js";

async function createFacility(req: Request, res: Response) {
  const result = createAccommodationFacilitySchema.safeParse(req.body);

  
  if (!result.success) {
    return handleZodError(res, result.error);
  }
  return await service.createAccommodationFacility(res, result.data);
}

export { createFacility };
