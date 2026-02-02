import { Router } from "express";
import { allocationController } from "../controller/allocation.controller.js";
import auth from "../../middleware/auth.js";

/**
 * @swagger
 * tags:
 *   - name: Accommodation Allocation
 *     description: Accommodation allocation and booking operations
 */

export default function registerAllocationRoutes(app: Router) {
  const router = Router();

  /**
   * @swagger
   * /allocation/hostel:
   *   post:
   *     summary: Secure/allocate hostel accommodation for a user (User)
   *     tags: [Accommodation Allocation]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InitiateAccommodationAllocationRequest'
   *     responses:
   *       200:
   *         description: Accommodation allocation initiated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: Invalid request payload
   *       401:
   *         description: Unauthorized - Authentication required
   *       404:
   *         description: Event, user, or facility not found
   */
  router.post("/hostel", auth, (req, res) =>
    allocationController.secureAccommodation(res, req),
  );

  /**
   * @swagger
   * /allocation/hotel:
   *   post:
   *     summary: Secure/allocate hotel accommodation for a user (User)
   *     tags: [Accommodation Allocation]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InitiateHotelAllocationRequest'
   *     responses:
   *       200:
   *         description: Hotel allocation initiated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: Invalid request payload
   *       401:
   *         description: Unauthorized - Authentication required
   *       404:
   *         description: Event, user, or facility not found
   */
  router.post("/hotel", auth, (req, res) =>
    allocationController.secureHotelAccommodation(res, req),
  );

  app.use("/allocation", router);
}
