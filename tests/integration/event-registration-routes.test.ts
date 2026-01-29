import express from "express";
import request from "supertest";
import {beforeEach, describe, expect, it, vi} from "vitest";

const registrationController = {
    getMyRegistrations: vi.fn((_req, res) => res.status(200).json({action: "my"})),
    createRegistration: vi.fn((_req, res) => res.status(200).json({action: "create"})),
    getAllRegistrations: vi.fn((_req, res) => res.status(200).json({action: "all"})),
    getRegistrationsByEventId: vi.fn((_req, res) => res.status(200).json({action: "event"})),
    getRegistrationById: vi.fn((_req, res) => res.status(200).json({action: "get"})),
    adminCreateRegistration: vi.fn((_req, res) => res.status(200).json({action: "admin-create"})),
    updateRegistration: vi.fn((_req, res) => res.status(200).json({action: "update"})),
    deleteRegistration: vi.fn((_req, res) => res.status(200).json({action: "delete"})),
};

vi.mock("../../src/api/events/controller/event-registration.controller.js", () => ({
    eventRegistrationController: registrationController,
}));
vi.mock("../../src/api/middleware/auth.js", () => ({
    default: (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));
vi.mock("../../src/api/middleware/adminAuth.js", () => ({
    default: (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));

const {default: registerEventRegistrationRoutes} = await import(
    "../../src/api/events/route/event-registration.routes.js"
);

describe("event registration routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("wires registration endpoints", async () => {
        const app = express();
        app.use(express.json());
        registerEventRegistrationRoutes(app);

        await request(app).get("/registrations/my-registrations").expect(200, {action: "my"});
        await request(app).post("/registrations").send({}).expect(200, {action: "create"});
        await request(app).get("/registrations").expect(200, {action: "all"});
        await request(app).get("/registrations/event/123").expect(200, {action: "event"});
        await request(app).get("/registrations/123").expect(200, {action: "get"});
        await request(app).post("/registrations/admin").send({}).expect(200, {action: "admin-create"});
        await request(app).put("/registrations/123").send({}).expect(200, {action: "update"});
        await request(app).delete("/registrations/123").expect(200, {action: "delete"});

        expect(registrationController.getMyRegistrations).toHaveBeenCalled();
        expect(registrationController.createRegistration).toHaveBeenCalled();
        expect(registrationController.getAllRegistrations).toHaveBeenCalled();
        expect(registrationController.getRegistrationsByEventId).toHaveBeenCalled();
        expect(registrationController.getRegistrationById).toHaveBeenCalled();
        expect(registrationController.adminCreateRegistration).toHaveBeenCalled();
        expect(registrationController.updateRegistration).toHaveBeenCalled();
        expect(registrationController.deleteRegistration).toHaveBeenCalled();
    });
});
