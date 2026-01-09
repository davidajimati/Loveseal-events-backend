import {Router} from "express";
import * as controller from "./events.controller.js"

export default function registerEventRoutes(app: Router) {
    const router = Router();

    router.get("/", controller.getAllEvents);
    router.get("/:id", controller.getEventById);
    router.post("/", controller.createEvent);
    router.put("/", controller.updateEvent);
    router.delete("/:id", controller.deleteEvent);

    app.use("/events", router);
}