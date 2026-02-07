import {Router} from "express";
import * as controller from "./admin.dashboard.controller.js";
import adminAuth from "../../middleware/adminAuth.js"

/**
 * @swagger
 * tags:
 *   - name: User Profile Management
 *     description: User profile management operations
 */

export default function registerAdminDashboardRoutes(app: Router) {
    const router = Router();

    /**
     * @swagger
     * /admin/dashboard/user-info:
     *   get:
     *     summary: Get user profile (Admin)
     *     tags: [User Profile Management]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User profile retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       401:
     *         description: Unauthorized - Authentication required
     */
    router.post("/user-info", adminAuth, controller.getUserProfileForAdmin)
    app.use("/admin/dashboard", router);
}