import type { Request, Response } from "express";
import { AllocationService } from "../service/allocation.service.js";
import {
  initiateAccommodationAllocationSchema,
  initiateHotelAllocationSchema,
} from "../model/allocation.model.js";
import { handleZodError } from "../../exceptions/exceptionsHandler.js";
import { HotelAllocationService } from "../service/hotelAllocation.service.js";

class AllocationController {
  private allocationService: AllocationService;
  private hotelAllocationService: HotelAllocationService;

  constructor() {
    this.allocationService = new AllocationService();
    this.hotelAllocationService = new HotelAllocationService();
  }

  async secureAccommodation(res: Response, req: Request) {
    const result = initiateAccommodationAllocationSchema.safeParse(req.body);
    if (!result.success) {
      return handleZodError(res, result.error);
    }

    return await this.allocationService.initiateHostelAllocation(
      res,
      result.data,
    );
  }

  async secureHotelAccommodation(res: Response, req: Request) {
    const result = initiateHotelAllocationSchema.safeParse(req.body);
    if (!result.success) {
      return handleZodError(res, result.error);
    }

    return await this.hotelAllocationService.initiateHotelAllocation(
      res,
      result.data,
    );
  }
}

export const allocationController = new AllocationController();
