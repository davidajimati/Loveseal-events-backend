import {Router} from "express";
import * as controller from "../controller/accommodation.controller.js";
import auth from "../../middleware/auth.js";
import adminAuth from "../../middleware/adminAuth.js";

/**
 * @swagger
 * tags:
 *   - name: Accommodation
 *     description: Accommodation, facilities, hotels, and hostels management
 */

export default function registerAccommodationRoutes(app: Router) {
    const router = Router();

    /**
     * @swagger
     * /accommodation/facility:
     *   post:
     *     summary: Create a facility (Admin)
     *     tags: [Accommodation]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateAccommodationFacilityRequest'
     *     responses:
     *       201:
     *         description: Facility created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid request payload
     */
    router.post("/facility", adminAuth, controller.createFacility);

    /**
     * @swagger
     * /accommodation/facility/{categoryId}:
     *   get:
     *     summary: Get facilities by category ID(user)
     *     tags: [Accommodation]
     *     parameters:
     *       - in: path
     *         name: categoryId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Facilities retrieved successfully
     *       404:
     *         description: Category not found
     */
    router.get("/facility/:categoryId", auth, controller.getFacility);

    /**
     * @swagger
     * /accommodation/facility/{categoryId}:
     *   get:
     *     summary: Get facilities by category ID(admin)
     *     tags: [Accommodation]
     *     parameters:
     *       - in: path
     *         name: categoryId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Facilities retrieved successfully
     *       404:
     *         description: Category not found
     */
    router.get("/admin/facility/:categoryId", adminAuth, controller.getFacility);

    /**
     * @swagger
     * /accommodation/hotels/{facilityId}:
     *   get:
     *     summary: Get hotel rooms by facility ID (user)
     *     tags: [Accommodation]
     *     parameters:
     *       - in: path
     *         name: facilityId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Hotel rooms retrieved successfully
     *       404:
     *         description: Facility not found
     */
    router.get("/hotels/:facilityId", auth, controller.getHotelRooms);

    /**
     * @swagger
     * /accommodation/hotels/{facilityId}:
     *   get:
     *     summary: Get hotel rooms by facility ID (Admin)
     *     tags: [Accommodation]
     *     parameters:
     *       - in: path
     *         name: facilityId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Hotel rooms retrieved successfully
     *       404:
     *         description: Facility not found
     */
    router.get("/admin/hotels/:facilityId", adminAuth, controller.getHotelRooms);

    /**
     * @swagger
     * /accommodation/category:
     *   post:
     *     summary: Create accommodation categories (Admin)
     *     tags: [Accommodation]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateAccommodationCategoryRequest'
     *     responses:
     *       201:
     *         description: Category created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    router.post("/category", adminAuth, controller.createCategories);

    /**
     * @swagger
     * /accommodation/hostel:
     *   post:
     *     summary: Create hostel accommodation (Admin)
     *     tags: [Accommodation]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateHostelAccommodationRequest'
     *     responses:
     *       201:
     *         description: Hostel accommodation created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    router.post("/hostel", adminAuth, controller.createHostelAccommodation);

    /**
     * @swagger
     * /accommodation/hotel:
     *   post:
     *     summary: Create hotel accommodation (Admin)
     *     tags: [Accommodation]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateHotelAccommodationRequest'
     *     responses:
     *       201:
     *         description: Hotel accommodation created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    router.post("/hotel", adminAuth, controller.createHotelAccommodation);

    /**
     * @swagger
     * /accommodation/categories:
     *   get:
     *     summary: Get all accommodation categories (user)
     *     tags: [Accommodation]
     *     responses:
     *       200:
     *         description: Categories retrieved successfully
     */
    router.get("/categories", auth, controller.getAllCategoriesInfo);

    /**
     * @swagger
     * /accommodation/categories:
     *   get:
     *     summary: Get all accommodation categories (Admin)
     *     tags: [Accommodation]
     *     responses:
     *       200:
     *         description: Categories retrieved successfully
     */
    router.get("/admin/categories", adminAuth, controller.getAllCategoriesInfo);

    /**
     * @swagger
     * /accommodation/delete-accommodation/{accommodationId}:
     *   delete:
     *     summary: Delete an accommodation
     *     tags: [Accommodation]
     *     parameters:
     *       - in: path
     *         name: accommodationId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Accommodation deleted successfully
     *       404:
     *         description: Accommodation not found
     */

    /**
     * @swagger
     * /accommodation/initialize:
     *   post:
     *     summary: Initialize payment for accommodation booking (User)
     *     tags: [Accommodation]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/InitiatePaymentRequest'
     *     responses:
     *       200:
     *         description: Payment initialized successfully
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/InitiatePaymentResponse'
     *       400:
     *         description: Invalid request payload
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: User or event not found
     */
    router.post("/initialize", auth, controller.createAccommodationRequest);

    router.delete("/delete-accommodation/:accommodationId", (_req, res) => {
        res.status(501).json({code: "99", message: "Not Implemented", data: null});
    });

    app.use("/accommodation", router);
}