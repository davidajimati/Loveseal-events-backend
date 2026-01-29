import express from "express";
import request from "supertest";
import {beforeEach, describe, expect, it, vi} from "vitest";

const adminController = {
    createAdminProfile: vi.fn((_req, res) => res.status(200).json({action: "create"})),
    getAdminProfile: vi.fn((_req, res) => res.status(200).json({action: "get"})),
    updateAdminProfile: vi.fn((_req, res) => res.status(200).json({action: "update"})),
    deleteAdminProfile: vi.fn((_req, res) => res.status(200).json({action: "delete"})),
};

vi.mock("../../src/api/adminConsole/adminProfileMgt/admin.controller.js", () => adminController);
vi.mock("../../src/api/middleware/adminAuth.js", () => ({
    default: (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));

const {default: registerAdminRoutes} = await import(
    "../../src/api/adminConsole/adminProfileMgt/admin.route.js"
);

describe("admin profile routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("wires admin profile endpoints", async () => {
        const app = express();
        app.use(express.json());
        registerAdminRoutes(app);

        await request(app).post("/admin-user-x").send({}).expect(200, {action: "create"});
        await request(app).get("/admin-user-x").expect(200, {action: "get"});
        await request(app).put("/admin-user-x/123").send({}).expect(200, {action: "update"});
        await request(app).delete("/admin-user-x/123").expect(200, {action: "delete"});

        expect(adminController.createAdminProfile).toHaveBeenCalled();
        expect(adminController.getAdminProfile).toHaveBeenCalled();
        expect(adminController.updateAdminProfile).toHaveBeenCalled();
        expect(adminController.deleteAdminProfile).toHaveBeenCalled();
    });
});
