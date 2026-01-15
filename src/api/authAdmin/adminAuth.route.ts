import {Router} from "express";
import * as controller from "./adminAuth.controller.js";

export default function registerAdminAuthRoutes(app: Router) {
    const router = Router();

    router.get("/login", controller.adminUserLogin);
    router.post("/otp-generate", controller.generateOtp);
    router.post("/otp-validate", controller.validateOtp);

    app.use("/admin-x-auth", router);
}