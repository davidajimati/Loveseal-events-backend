import express from "express";
import request from "supertest";
import {beforeEach, describe, expect, it, vi} from "vitest";

const eventsController = {
    getAllEvents: vi.fn((_req, res) => res.status(200).json({action: "list"})),
    getActiveEvents: vi.fn((_req, res) => res.status(200).json({action: "active"})),
    getEventById: vi.fn((_req, res) => res.status(200).json({action: "get"})),
    createEvent: vi.fn((_req, res) => res.status(200).json({action: "create"})),
    updateEvent: vi.fn((_req, res) => res.status(200).json({action: "update"})),
    deleteEvent: vi.fn((_req, res) => res.status(200).json({action: "delete"})),
    setEventToDraft: vi.fn((_req, res) => res.status(200).json({action: "draft"})),
    setEventToActive: vi.fn((_req, res) => res.status(200).json({action: "activate"})),
    setEventToClosed: vi.fn((_req, res) => res.status(200).json({action: "close"})),
};

vi.mock("../../src/api/events/controller/events.controller.js", () => ({eventsController}));
vi.mock("../../src/api/middleware/auth.js", () => ({
    default: (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));
vi.mock("../../src/api/middleware/adminAuth.js", () => ({
    default: (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));

const {default: registerEventRoutes} = await import("../../src/api/events/route/events.routes.js");

describe("events routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("wires events endpoints", async () => {
        const app = express();
        app.use(express.json());
        registerEventRoutes(app);

        await request(app).get("/events").expect(200, {action: "list"});
        await request(app).get("/events/active").expect(200, {action: "active"});
        await request(app).get("/events/123").expect(200, {action: "get"});
        await request(app).post("/events").send({}).expect(200, {action: "create"});
        await request(app).put("/events/123").send({}).expect(200, {action: "update"});
        await request(app).delete("/events/123").expect(200, {action: "delete"});
        await request(app).patch("/events/123/draft").expect(200, {action: "draft"});
        await request(app).patch("/events/123/active").expect(200, {action: "activate"});
        await request(app).patch("/events/123/closed").expect(200, {action: "close"});

        expect(eventsController.getAllEvents).toHaveBeenCalled();
        expect(eventsController.getActiveEvents).toHaveBeenCalled();
        expect(eventsController.getEventById).toHaveBeenCalled();
        expect(eventsController.createEvent).toHaveBeenCalled();
        expect(eventsController.updateEvent).toHaveBeenCalled();
        expect(eventsController.deleteEvent).toHaveBeenCalled();
        expect(eventsController.setEventToDraft).toHaveBeenCalled();
        expect(eventsController.setEventToActive).toHaveBeenCalled();
        expect(eventsController.setEventToClosed).toHaveBeenCalled();
    });
});
