import {Router} from "express";
import * as controller from "./user.controller.js";
import adminAuth from "../middleware/adminAuth.js"
import auth from "../middleware/auth.js";

/**
 * @swagger
 * tags:
 *   - name: User Profile Management
 *     description: User profile management operations
 */

export default function registerUserRoutes(app: Router) {
    const router = Router();
    
    /**
     * @swagger
     * /user:
     *   get:
     *     summary: Get current user profile (User)
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
    router.get("/", auth, controller.getUserProfile)

    /**
     * @swagger
     * /user/admin/count-users:
     *   get:
     *     summary: Get total count of users (Admin)
     *     tags: [User Profile Management]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User count retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       401:
     *         description: Unauthorized - Admin authentication required
     */
    router.get("/admin/count-users", adminAuth, controller.getUsersCount)

    /**
     * @swagger
     * /user:
     *   post:
     *     summary: Create a new user profile
     *     tags: [User Profile Management]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateUserProfileRequest'
     *     responses:
     *       200:
     *         description: User profile created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid request payload
     */
    router.post("/", controller.createUserProfile);

    /**
     * @swagger
     * /user:
     *   put:
     *     summary: Update current user profile (User)
     *     tags: [User Profile Management]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateUserProfileRequest'
     *     responses:
     *       200:
     *         description: User profile updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid request payload
     *       401:
     *         description: Unauthorized - Authentication required
     *       403:
     *         description: Forbidden - Cannot update another user's profile
     */
    router.put("/", auth, controller.updateUserProfile);

    /**
     * @swagger
     * /user:
     *   delete:
     *     summary: Delete current user profile (User)
     *     tags: [User Profile Management]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User profile deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: User profile not found
     */
    router.delete("/", auth, controller.deleteUserProfile)

    app.use("/user", router);
}
