import {Router} from "express";
import * as controller from "./user.controller.js";

export default function registerUserRoutes(app: Router) {
    const router = Router();

    router.get("/:id", controller.getUserProfile)
    router.get("/users-count", controller.getUsersCount)
    router.post("/", controller.createUserProfile);
    router.put("/", controller.updateUserProfile);
    router.put("/admin-update", controller.updateUserProfile); // todo: use admin auth
    router.delete("/:id", controller.deleteUserProfile)

    app.use("/user", router);
}