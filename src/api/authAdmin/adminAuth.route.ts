import {Router} from "express";
import * as controller from "./adminAuth.controller.js";

export default function registerAdminAuthRoutes(app: Router) {
    const router = Router();

    /**
     * @swagger
     * tags:
     *   - name: AdminAuth
     *     description: Admin authentication (OTP + token verification)
     */

    /**
     * @swagger
     * /admin-x-auth/login:
     *   get:
     *     summary: Verify an admin token (Bearer)
     *     tags: [AdminAuth]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Token is valid
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       401:
     *         description: Missing/invalid token
     */
    router.get("/login", controller.adminUserLogin);

    /**
     * @swagger
     * /admin-x-auth/otp-generate:
     *   post:
     *     summary: Generate OTP for admin login (email must be an admin user)
     *     tags: [AdminAuth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/GenerateOtpRequest'
     *     responses:
     *       200:
     *         description: OTP generated (delivery out-of-band)
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       401:
     *         description: Not an admin user
     *       400:
     *         description: Invalid payload
     */
    router.post("/otp-generate", controller.generateOtp);

    /**
     * @swagger
     * /admin-x-auth/otp-validate:
     *   post:
     *     summary: Validate OTP and return an admin login token
     *     tags: [AdminAuth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ValidateOtpRequest'
     *     responses:
     *       200:
     *         description: OTP validated, token issued
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid payload / OTP validation failed
     */
    router.post("/otp-validate", controller.validateOtp);

    app.use("/admin-x-auth", router);
}