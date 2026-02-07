import type { Request, Response } from "express";
import { BillingService } from "../service/billing.service.js";

class BillingController {
  private billingService: BillingService;

  constructor() {
    this.billingService = new BillingService();
    this.verifyPayment = this.verifyPayment.bind(this);
  }

  async verifyPayment(req: Request, res: Response) {
    return await this.billingService.verifyPayment(res, req.body);
  }
}

export const billingController = new BillingController();
