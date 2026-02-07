import { Router } from "express";
import { eventRegistrationController } from "../controller/event-registration.controller.js";
import auth from "../../middleware/auth.js";
import adminAuth from "../../middleware/adminAuth.js";

/**
 * @swagger
 * tags:
 *   - name: Event Registrations
 *     description: Event registration management operations
 */

export default function registerEventRegistrationRoutes(app: Router) {
    const router = Router();

    /**
     * @swagger
     * /registrations/my-registrations:
     *   get:
     *     summary: Get current user's event registrations (User)
     *     tags: [Event Registrations]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Page number for pagination
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Number of items per page
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *         description: Field to sort by
     *       - in: query
     *         name: sortOrder
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *         description: Sort order
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Search term
     *     responses:
     *       200:
     *         description: User registrations retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       401:
     *         description: Unauthorized - Authentication required
     */
    router.get("/my-registrations", auth, (req, res) => eventRegistrationController.getMyRegistrations(req, res));

    /**
     * @swagger
     * /registrations:
     *   post:
     *     summary: Create a new event registration (user-initiated) (User)
     *     tags: [Event Registrations]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateEventRegistrationRequestUser'
     *     responses:
     *       200:
     *         description: Registration created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid request payload
     *       401:
     *         description: Unauthorized - Authentication required
     */
    router.post("/", auth, (req, res) => eventRegistrationController.createRegistration(req, res));

    /**
     * @swagger
     * /registrations/all:
     *   get:
     *     summary: Get all event registrations for all events (Admin)
     *     tags: [Event Registrations]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Page number for pagination
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Number of items per page
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *         description: Field to sort by
     *       - in: query
     *         name: sortOrder
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *         description: Sort order
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Search term
     *     responses:
     *       200:
     *         description: All registrations retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       401:
     *         description: Unauthorized - Admin authentication required
     */
    router.get("/all", adminAuth, (req, res) => eventRegistrationController.getAllRegistrations(req, res));

    /**
     * @swagger
     * /registrations/event/{eventId}:
     *   get:
     *     summary: Get all registrations for a specific event (Admin)
     *     tags: [Event Registrations]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: eventId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Event ID
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Page number for pagination
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Number of items per page
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *         description: Field to sort by
     *       - in: query
     *         name: sortOrder
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *         description: Sort order
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Search term
     *     responses:
     *       200:
     *         description: Event registrations retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid event ID
     *       401:
     *         description: Unauthorized - Admin authentication required
     */
    router.get("/event/:eventId", adminAuth, (req, res) => eventRegistrationController.getRegistrationsByEventId(req, res));

    /**
     * @swagger
     * /registrations/{id}:
     *   get:
     *     summary: Get registration by ID (User)
     *     tags: [Event Registrations]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Registration ID
     *     responses:
     *       200:
     *         description: Registration retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid registration ID
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Registration not found
     */
    router.get("/:id", auth, (req, res) => eventRegistrationController.getRegistrationById(req, res));

    /**
     * @swagger
     * /registrations/admin/create:
     *   post:
     *     summary: Create a new event registration (Admin)
     *     tags: [Event Registrations]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateEventRegistrationRequestAdmin'
     *     responses:
     *       200:
     *         description: Registration created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid request payload
     *       401:
     *         description: Unauthorized - Admin authentication required
     */
    router.post("/admin/create", adminAuth, (req, res) => eventRegistrationController.adminCreateRegistration(req, res));

    /**
     * @swagger
     * /registrations/{id}:
     *   put:
     *     summary: Update an event registration (User)
     *     tags: [Event Registrations]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Registration ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateEventRegistrationRequest'
     *     responses:
     *       200:
     *         description: Registration updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid request payload or registration ID
     *       401:
     *         description: Unauthorized - Admin authentication required
     *       404:
     *         description: Registration not found
     */
    router.put("/:id", auth, (req, res) => eventRegistrationController.updateRegistration(req, res));


  /**
     * @swagger
     * /admin/registrations/{id}:
     *   put:
     *     summary: Update an event registration for user(Admin)
     *     tags: [Event Registrations]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Registration ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateEventRegistrationRequest'
     *     responses:
     *       200:
     *         description: Registration updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid request payload or registration ID
     *       401:
     *         description: Unauthorized - Admin authentication required
     *       404:
     *         description: Registration not found
     */
    router.put("/admin/:id", adminAuth, (req, res) => eventRegistrationController.updateRegistration(req, res));

    /**
     * @swagger
     * /registrations/{id}:
     *   delete:
     *     summary: Delete an event registration (User)
     *     tags: [Event Registrations]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Registration ID
     *     responses:
     *       200:
     *         description: Registration deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid registration ID
     *       401:
     *         description: Unauthorized - Admin authentication required
     *       404:
     *         description: Registration not found
     */
    router.delete("/:id", auth, (req, res) => eventRegistrationController.deleteRegistration(req, res));


    /**
     * @swagger
     * /registrations/admin/:regId:
     *   delete:
     *     summary: Delete an event registration for user (Admin)
     *     tags: [Event Registrations]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Registration ID
     *     responses:
     *       200:
     *         description: Registration deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid registration ID
     *       401:
     *         description: Unauthorized - Admin authentication required
     *       404:
     *         description: Registration not found
     */
    router.delete("/admin/:id", adminAuth, (req, res) => eventRegistrationController.adminDeleteRegistration(req, res));

    app.use("/registrations", router);
}
