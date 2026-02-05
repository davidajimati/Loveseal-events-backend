import {Router} from "express";
import auth from "../middleware/auth.js";
import * as controller from "./user.dashboard.controller.js";

/**
 * @swagger
 * tags:
 *   - name: User Dashboard
 *     description: User dashboard operations including dependants and accommodation booking
 */

export default function userDashboardRoutes(app: Router) {
  const router = Router();

  /**
   * @swagger
   * /user-dashboard/:eventId
   *   get:
   *     summary: Get user dashboard information (User)
   *     tags: [User Dashboard]
   *    parameters:
   *       - in: path
   *         name: eventId
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dashboard data retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       401:
   *         description: Unauthorized - Authentication required
   */
  router.get("/:eventId", auth, controller.dashboard);

  /**
   * @swagger
   * /user-dashboard/add-dependent:
   *   post:
   *     summary: Add a dependant to user's registration (User)
   *     tags: [User Dashboard]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AddDependantRequest'
   *     responses:
   *       200:
   *         description: Dependant added successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: Invalid request payload
   *       401:
   *         description: Unauthorized - Authentication required
   */
  router.post("/add-dependent", auth, controller.addDependant);

  /**
   * @swagger
   * /user-dashboard/remove-dependent/{id}:
   *   delete:
   *     summary: Remove a dependant from user's registration (User)
   *     tags: [User Dashboard]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Dependant ID
   *     responses:
   *       200:
   *         description: Dependant removed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: Invalid dependant ID
   *       401:
   *         description: Unauthorized - Authentication required
   *       404:
   *         description: Dependant not found
   */
  router.delete("/remove-dependent/:id", auth, controller.removeDependant);

  /**
   * @swagger
   * /user-dashboard/pay-for-dependants:
   *   post:
   *     summary: Pay for dependants (User)
   *     tags: [User Dashboard]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PayForDependantRequest'
   *     responses:
   *       200:
   *         description: Payment processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: Invalid request payload
   *       401:
   *         description: Unauthorized - Authentication required
   */
  router.post("/pay-for-dependants", auth, controller.payForDependants);

  /**
   * @swagger
   * /user-dashboard/book-accommodation:
   *   post:
   *     summary: Book accommodation for user (User)
   *     tags: [User Dashboard]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BookAccommodationRequest'
   *     responses:
   *       200:
   *         description: Accommodation booked successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: Invalid request payload
   *       401:
   *         description: Unauthorized - Authentication required
   */
  router.post("/book-accommodation", auth, controller.bookAccommodation);

  app.use("/user-dashboard", router);
}
