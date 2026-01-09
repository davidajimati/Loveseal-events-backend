import {Router} from "express";
import * as controller from "./userAuth.controller.js"

export default function registerUserAuthRoutes(app: Router) {
    const router = Router();

    router.post("/login", controller.userLogin);
    router.post("/generate-otp", controller.generateOtp);
    router.post("/validate-otp", controller.validateOtp);
    app.use("/user-auth", router);
}