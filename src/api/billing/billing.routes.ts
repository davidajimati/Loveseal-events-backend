import { Router } from "express";
import { billingController } from "./billing.controller.js";

export default function registerBillingRoutes(app: Router) {
  const router = Router();

  router.post("/verify", (req, res) =>
    billingController.verifyPayment(req, res)
  );

  app.use("/billing", router);
}
