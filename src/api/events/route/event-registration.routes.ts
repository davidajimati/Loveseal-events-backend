import { Router } from "express";
import { eventRegistrationController } from "../controller/event-registration.controller.js";
import auth from "@api/middleware/auth.js";
import adminAuth from "@api/middleware/adminAuth.js";

export default function registerEventRegistrationRoutes(app: Router) {
    const router = Router();

    // User routes
    router.get("/my-registrations", auth, (req, res) => eventRegistrationController.getMyRegistrations(req, res));
    router.post("/", auth, (req, res) => eventRegistrationController.createRegistration(req, res));

    // Admin routes
    router.get("/", adminAuth, (req, res) => eventRegistrationController.getAllRegistrations(req, res));
    router.get("/event/:eventId", adminAuth, (req, res) => eventRegistrationController.getRegistrationsByEventId(req, res));
    router.get("/:id", auth, (req, res) => eventRegistrationController.getRegistrationById(req, res));
    router.post("/admin", adminAuth, (req, res) => eventRegistrationController.adminCreateRegistration(req, res));
    router.put("/:id", adminAuth, (req, res) => eventRegistrationController.updateRegistration(req, res));
    router.delete("/:id", adminAuth, (req, res) => eventRegistrationController.deleteRegistration(req, res));

    app.use("/registrations", router);
}
