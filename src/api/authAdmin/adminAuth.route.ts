import {Router} from "express";
import * as controller from "./adminAuth.controller.js";
import adminAuth from "../middleware/adminAuth.js";

export default function registerAdminAuthRoutes(app: Router) {
    const router = Router();

    router.post("/login", adminAuth);
    router.post("/otp-generate", controller.generateOtp);
    router.post("/otp-validate", controller.validateOtp);
    app.use("/admin-x-auth", router);
}