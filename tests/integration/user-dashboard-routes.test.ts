import express from "express";
import request from "supertest";
import {beforeEach, describe, expect, it, vi} from "vitest";

const dashboardController = {
    dashboard: vi.fn((_req, res) => res.status(200).json({action: "dashboard"})),
    addDependant: vi.fn((_req, res) => res.status(200).json({action: "add"})),
    removeDependant: vi.fn((_req, res) => res.status(200).json({action: "remove"})),
    payForDependants: vi.fn((_req, res) => res.status(200).json({action: "pay"})),
    bookAccommodation: vi.fn((_req, res) => res.status(200).json({action: "book"})),
};

vi.mock("../../src/api/userDashboard/user.dashboard.controller.js", () => dashboardController);
vi.mock("../../src/api/middleware/auth.js", () => ({
    default: (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));

const {default: registerUserDashboardRoutes} = await import(
    "../../src/api/userDashboard/user.dashboard.route.js"
);

describe("user dashboard routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("wires user dashboard endpoints", async () => {
        const app = express();
        app.use(express.json());
        registerUserDashboardRoutes(app);

        await request(app).get("/user-dashboard").expect(200, {action: "dashboard"});
        await request(app).post("/user-dashboard/add-dependent").send({}).expect(200, {action: "add"});
        await request(app).delete("/user-dashboard/remove-dependent/1").expect(200, {action: "remove"});
        await request(app).post("/user-dashboard/pay-for-dependants").send({}).expect(200, {action: "pay"});
        await request(app).post("/user-dashboard/book-accommodation").send({}).expect(200, {action: "book"});

        expect(dashboardController.dashboard).toHaveBeenCalled();
        expect(dashboardController.addDependant).toHaveBeenCalled();
        expect(dashboardController.removeDependant).toHaveBeenCalled();
        expect(dashboardController.payForDependants).toHaveBeenCalled();
        expect(dashboardController.bookAccommodation).toHaveBeenCalled();
    });
});
