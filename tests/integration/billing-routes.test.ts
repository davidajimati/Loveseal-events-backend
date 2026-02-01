import express from "express";
import request from "supertest";
import {beforeEach, describe, expect, it, vi} from "vitest";

const billingController = {
    verifyPayment: vi.fn((_req, res) => res.status(200).json({action: "verify"})),
};

vi.mock("../../src/api/billing/controller/billing.controller.js", () => ({
    billingController,
}));

const {default: registerBillingRoutes} = await import(
    "../../src/api/billing/route/billing.routes.js"
);

describe("billing routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("wires billing endpoints", async () => {
        const app = express();
        app.use(express.json());
        registerBillingRoutes(app);

        await request(app).post("/billing/verify").send({}).expect(200, {action: "verify"});
        expect(billingController.verifyPayment).toHaveBeenCalled();
    });
});
