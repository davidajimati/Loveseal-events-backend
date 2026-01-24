import {Router} from "express";
import * as controller from "./userAuth.controller.js";

export default function registerUserAuthRoutes(app: Router) {
    const router = Router();

    /**
     * @swagger
     * tags:
     *   - name: UserAuth
     *     description: User authentication (OTP + token verification)
     */

    /**
     * @swagger
     * /user-auth/login:
     *   get:
     *     summary: Verify a user token (Bearer)
     *     tags: [UserAuth]
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
    router.get("/login", controller.userLogin);

    /**
     * @swagger
     * /user-auth/generate-otp:
     *   post:
     *     summary: Generate OTP for user login (email must already have a profile)
     *     tags: [UserAuth]
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
     *       400:
     *         description: Invalid payload
     */
    router.post("/generate-otp", controller.generateOtp);

    /**
     * @swagger
     * /user-auth/otp-for-registrant:
     *   post:
     *     summary: Generate an OTP for a registrant by email
     *     tags: [UserAuth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RegistrantOtpRequest'
     *     responses:
     *       200:
     *         description: OTP generated (delivery out-of-band)
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid email
     */
    router.post("/otp-for-registrant", controller.generateTokenForRegistrant);

    /**
     * @swagger
     * /user-auth/validate-otp:
     *   post:
     *     summary: Validate OTP and return a login token
     *     tags: [UserAuth]
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
    router.post("/validate-otp", controller.validateOtp);
    app.use("/user-auth", router);
}
