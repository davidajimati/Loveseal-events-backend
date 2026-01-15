import {Router} from "express";
import * as controller from "./user.controller.js";
import adminAuth from "../middleware/adminAuth.js"
import auth from "../middleware/auth.js";

export default function registerUserRoutes(app: Router) {
    const router = Router();

    router.get("/", auth, controller.getUserProfile)
    router.get("/users-count", adminAuth, controller.getUsersCount)
    router.post("/", controller.createUserProfile);
    router.put("/", auth, controller.updateUserProfile);
    router.delete("/", auth, controller.deleteUserProfile)

    app.use("/user", router);
}
