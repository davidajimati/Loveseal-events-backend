import { Router } from "express";
import { eventsController } from "../controller/events.controller.js";
import auth from "@api/middleware/auth.js";
import adminAuth from "@api/middleware/adminAuth.js";

export default function registerEventRoutes(app: Router) {
    const router = Router();

    router.get("/", auth, (req, res) => eventsController.getAllEvents(req, res));
    router.get("/:id", auth, (req, res) => eventsController.getEventById(req, res));
    router.post("/", adminAuth, (req, res) => eventsController.createEvent(req, res));
    router.put("/:id", adminAuth, (req, res) => eventsController.updateEvent(req, res));
    router.delete("/:id", adminAuth, (req, res) => eventsController.deleteEvent(req, res));

    app.use("/events", router);
}
