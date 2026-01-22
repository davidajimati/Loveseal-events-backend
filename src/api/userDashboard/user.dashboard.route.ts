import {Router} from "express";
import auth from "../middleware/auth.js";
import * as controller from "./user.dashboard.controller.js";

export default function userDashboardRoutes(app: Router) {
    const router = Router();

    router.get("/", auth, controller.dashboard);
    router.post("/add-dependent", auth, controller.addDependant);
    router.delete("/remove-dependent/dependantId", auth, controller.removeDependant);
    router.post("/pay-for-dependants", auth, controller.payForDependants);
    router.post("/book accommodation", auth, controller.bookAccommodation);

    app.use("/user-dashboard", router);
}
