import {Router} from "express";
import {billingController} from "../controller/billing.controller.js";

/**
 * @swagger
 * tags:
 *   - name: Billing
 *     description: Payment processing and verification operations
 */

export default function registerBillingRoutes(app: Router) {
    const router = Router();

    /**
     * @swagger
     * /billing/verify:
     *   post:
     *     summary: Verify payment status from webhook (Korapay)
     *     tags: [Billing]
     *     description: This endpoint receives payment status webhooks from the payment provider and updates the payment record and accommodation allocation status accordingly.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PaymentStatusWebhook'
     *     responses:
     *       200:
     *         description: Payment verification processed successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid request payload or payment verification failed
     *       404:
     *         description: Transaction reference not found
     */
    router.post("/verify", billingController.verifyPayment);

    app.use("/billing", router);
}
