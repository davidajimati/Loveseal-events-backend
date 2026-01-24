import { Router } from "express";
import * as controller from "../controller/accommodation.controller.js";
import auth from "@api/middleware/auth.js";

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
   *     summary: Create a facility
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
  router.post("/facility", controller.createFacility);

  /**
   * @swagger
   * /accommodation/facility/{categoryId}:
   *   get:
   *     summary: Get facilities by category ID
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
  router.get("/facility/:categoryId", controller.getFacility);

  /**
   * @swagger
   * /accommodation/hotels/{facilityId}:
   *   get:
   *     summary: Get hotel rooms by facility ID
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
  router.get("/hotels/:facilityId", controller.getHotelRooms);

  /**
   * @swagger
   * /accommodation/category:
   *   post:
   *     summary: Create accommodation categories
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
  router.post("/category", controller.createCategories);

  /**
   * @swagger
   * /accommodation/hostel:
   *   post:
   *     summary: Create hostel accommodation
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
  router.post("/hostel", controller.createHostelAccommodation);

  /**
   * @swagger
   * /accommodation/hotel:
   *   post:
   *     summary: Create hotel accommodation
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
  router.post("/hotel", controller.createHotelAccommodation);

  /**
   * @swagger
   * /accommodation/categories:
   *   get:
   *     summary: Get all accommodation categories
   *     tags: [Accommodation]
   *     responses:
   *       200:
   *         description: Categories retrieved successfully
   */
  router.get("/categories", controller.getAllCategoriesInfo);

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
   *     summary: Initialize payment for accommodation booking
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
    res.status(501).json({ code: "99", message: "Not Implemented", data: null });
  });

  app.use("/accommodation", router);
}