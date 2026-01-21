import {Router} from "express";
import * as controller from "./admin.controller.js";
import adminAuth from "../../middleware/adminAuth.js"

export default function registerAdminRoutes(app: Router) {
    const router = Router();

    router.post('/', adminAuth, controller.createAdminProfile);
    router.get('/', adminAuth, controller.getAdminProfile);
    router.put('/:id', adminAuth, controller.updateAdminProfile);
    router.delete('/:id', adminAuth, controller.deleteAdminProfile);

    app.use("/admin-user-x", router);
}
