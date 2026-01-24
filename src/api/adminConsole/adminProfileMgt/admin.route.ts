import {Router} from "express";
import * as controller from "./admin.controller.js";
import adminAuth from "../../middleware/adminAuth.js"

/**
 * @swagger
 * tags:
 *   - name: Admin Profile Management
 *     description: Admin user profile management operations
 */

export default function registerAdminRoutes(app: Router) {
    const router = Router();

    /**
     * @swagger
     * /admin-user-x:
     *   post:
     *     summary: Create a new admin user profile
     *     tags: [Admin Profile Management]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateAdminUserRequest'
     *     responses:
     *       200:
     *         description: Admin user created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid request payload
     *       401:
     *         description: Unauthorized - Admin authentication required
     */
    router.post('/', adminAuth, controller.createAdminProfile);

    /**
     * @swagger
     * /admin-user-x:
     *   get:
     *     summary: Get current admin user profile
     *     tags: [Admin Profile Management]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Admin profile retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       401:
     *         description: Unauthorized - Admin authentication required
     */
    router.get('/', adminAuth, controller.getAdminProfile);

    /**
     * @swagger
     * /admin-user-x/{id}:
     *   put:
     *     summary: Update an admin user profile
     *     tags: [Admin Profile Management]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Admin user ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateAdminUserRequest'
     *     responses:
     *       200:
     *         description: Admin profile updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid request payload
     *       401:
     *         description: Unauthorized - Admin authentication required
     *       403:
     *         description: Forbidden - Cannot update another admin's profile
     */
    router.put('/:id', adminAuth, controller.updateAdminProfile);

    /**
     * @swagger
     * /admin-user-x/{id}:
     *   delete:
     *     summary: Delete an admin user profile
     *     tags: [Admin Profile Management]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Admin user ID
     *     responses:
     *       200:
     *         description: Admin profile deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       401:
     *         description: Unauthorized - Admin authentication required
     *       404:
     *         description: Admin profile not found
     */
    router.delete('/:id', adminAuth, controller.deleteAdminProfile);

    app.use("/admin-user-x", router);
}
