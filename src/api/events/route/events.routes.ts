import { Router } from "express";
import { eventsController } from "../controller/events.controller.js";
import auth from "@api/middleware/auth.js";
import adminAuth from "@api/middleware/adminAuth.js";

export default function registerEventRoutes(app: Router) {
    const router = Router();

    router.get("/", adminAuth, (req, res) => eventsController.getAllEvents(req, res));
    router.get("/active", adminAuth, (req, res) => eventsController.getActiveEvents(req, res));
    router.get("/:id", auth, (req, res) => eventsController.getEventById(req, res));
    router.post("/", adminAuth, (req, res) => eventsController.createEvent(req, res));
    router.put("/:id", adminAuth, (req, res) => eventsController.updateEvent(req, res));
    router.delete("/:id", adminAuth, (req, res) => eventsController.deleteEvent(req, res));

    // Event status routes
    router.patch("/:id/draft", adminAuth, (req, res) => eventsController.setEventToDraft(req, res));
    router.patch("/:id/active", adminAuth, (req, res) => eventsController.setEventToActive(req, res));
    router.patch("/:id/closed", adminAuth, (req, res) => eventsController.setEventToClosed(req, res));

    app.use("/events", router);
}
