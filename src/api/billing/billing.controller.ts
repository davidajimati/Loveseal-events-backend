import type { Request, Response } from "express";
import { BillingService } from "./billing.service.js";
import type { PaymentStatusWebhook } from "./billing.model.js";

class BillingController {
  private billingService: BillingService;

  constructor() {
    this.billingService = new BillingService();
  }

  async verifyPayment(req: Request, res: Response) {
    return await this.billingService.verifyPayment(res, req.body);
  }
}
export const billingController = new BillingController();
