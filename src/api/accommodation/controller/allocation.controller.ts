import type { Request, Response } from "express";
import { AllocationService } from "../service/allocation.service.js";
import { initiateAccommodationAllocationSchema } from "../model/allocation.model.js";
import { handleZodError } from "../../exceptions/exceptionsHandler.js";

class AllocationController {
  private allocationService: AllocationService;

  constructor() {
    this.allocationService = new AllocationService();
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
}

export const allocationController = new AllocationController();
