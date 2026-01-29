import express from "express";
import request from "supertest";
import {beforeEach, describe, expect, it, vi} from "vitest";

const userAuthController = {
    userLogin: vi.fn((_req, res) => res.status(200).json({action: "login"})),
    generateOtp: vi.fn((_req, res) => res.status(200).json({action: "generate"})),
    validateOtp: vi.fn((_req, res) => res.status(200).json({action: "validate"})),
    generateTokenForRegistrant: vi.fn((_req, res) => res.status(200).json({action: "registrant"})),
};

vi.mock("../../src/api/authUser/userAuth.controller.js", () => userAuthController);

const {default: registerUserAuthRoutes} = await import("../../src/api/authUser/userAuth.route.js");

describe("user auth routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("wires user auth endpoints", async () => {
        const app = express();
        app.use(express.json());
        registerUserAuthRoutes(app);

        await request(app).get("/user-auth/login").expect(200, {action: "login"});
        await request(app).post("/user-auth/generate-otp").send({}).expect(200, {action: "generate"});
        await request(app).post("/user-auth/validate-otp").send({}).expect(200, {action: "validate"});
        await request(app)
            .post("/user-auth/otp-for-registrant")
            .send({})
            .expect(200, {action: "registrant"});

        expect(userAuthController.userLogin).toHaveBeenCalled();
        expect(userAuthController.generateOtp).toHaveBeenCalled();
        expect(userAuthController.validateOtp).toHaveBeenCalled();
        expect(userAuthController.generateTokenForRegistrant).toHaveBeenCalled();
    });
});
