import express from "express";
import request from "supertest";
import {beforeEach, describe, expect, it, vi} from "vitest";

const userController = {
    getUserProfile: vi.fn((_req, res) => res.status(200).json({action: "get"})),
    getUsersCount: vi.fn((_req, res) => res.status(200).json({action: "count"})),
    createUserProfile: vi.fn((_req, res) => res.status(200).json({action: "create"})),
    updateUserProfile: vi.fn((_req, res) => res.status(200).json({action: "update"})),
    deleteUserProfile: vi.fn((_req, res) => res.status(200).json({action: "delete"})),
};

vi.mock("../../src/api/userProfileMgt/user.controller.js", () => userController);
vi.mock("../../src/api/middleware/auth.js", () => ({
    default: (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));
vi.mock("../../src/api/middleware/adminAuth.js", () => ({
    default: (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));

const {default: registerUserRoutes} = await import("../../src/api/userProfileMgt/user.route.js");

describe("user profile routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("wires user profile endpoints", async () => {
        const app = express();
        app.use(express.json());
        registerUserRoutes(app);

        await request(app).get("/user").expect(200, {action: "get"});
        await request(app).get("/user/users-count").expect(200, {action: "count"});
        await request(app).post("/user").send({}).expect(200, {action: "create"});
        await request(app).put("/user").send({}).expect(200, {action: "update"});
        await request(app).delete("/user").expect(200, {action: "delete"});

        expect(userController.getUserProfile).toHaveBeenCalled();
        expect(userController.getUsersCount).toHaveBeenCalled();
        expect(userController.createUserProfile).toHaveBeenCalled();
        expect(userController.updateUserProfile).toHaveBeenCalled();
        expect(userController.deleteUserProfile).toHaveBeenCalled();
    });
});
