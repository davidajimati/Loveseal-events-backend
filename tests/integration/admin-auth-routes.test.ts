import express from "express";
import request from "supertest";
import {beforeEach, describe, expect, it, vi} from "vitest";

const adminAuthController = {
    adminUserLogin: vi.fn((_req, res) => res.status(200).json({action: "login"})),
    generateOtp: vi.fn((_req, res) => res.status(200).json({action: "generate"})),
    validateOtp: vi.fn((_req, res) => res.status(200).json({action: "validate"})),
};

vi.mock("../../src/api/authAdmin/adminAuth.controller.js", () => adminAuthController);

const {default: registerAdminAuthRoutes} = await import("../../src/api/authAdmin/adminAuth.route.js");

describe("admin auth routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("wires admin auth endpoints", async () => {
        const app = express();
        app.use(express.json());
        registerAdminAuthRoutes(app);

        await request(app).get("/admin-auth/login").expect(200, {action: "login"});
        await request(app).post("/admin-auth/otp-generate").send({}).expect(200, {action: "generate"});
        await request(app).post("/admin-auth/otp-validate").send({}).expect(200, {action: "validate"});

        expect(adminAuthController.adminUserLogin).toHaveBeenCalled();
        expect(adminAuthController.generateOtp).toHaveBeenCalled();
        expect(adminAuthController.validateOtp).toHaveBeenCalled();
    });
});
