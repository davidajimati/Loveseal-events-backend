import { Router } from "express";
import { eventsController } from "../controller/events.controller.js";
import auth from "../../middleware/auth.js";
import adminAuth from "../../middleware/adminAuth.js";

/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: Event management operations
 */

export default function registerEventRoutes(app: Router) {
    const router = Router();

    /**
     * @swagger
     * /events:
     *   get:
     *     summary: Get all events (with pagination) (Admin)
     *     tags: [Events]
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
     *         description: Events retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       401:
     *         description: Unauthorized - Admin authentication required
     */
    router.get("/", adminAuth, (req, res) => eventsController.getAllEvents(req, res));

    /**
     * @swagger
     * /events/user/active:
     *   get:
     *     summary: Get all active events for user (User)
     *     tags: [Events]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Active events retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       401:
     *         description: Unauthorized - Admin authentication required
     */
    router.get("/user/active", (req, res) => eventsController.getActiveEvents(req, res));


  /**
     * @swagger
     * /events/active:
     *   get:
     *     summary: Get all active events (Admin)
     *     tags: [Events]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Active events retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       401:
     *         description: Unauthorized - Admin authentication required
     */
    router.get("/active", adminAuth, (req, res) => eventsController.getActiveEvents(req, res));

    /**
     * @swagger
     * /events/{id}:
     *   get:
     *     summary: Get event by ID (User)
     *     tags: [Events]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Event ID
     *     responses:
     *       200:
     *         description: Event retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid event ID
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Event not found
     */
    router.get("/:id", auth, (req, res) => eventsController.getEventById(req, res));

    /**
     * @swagger
     * /events:
     *   post:
     *     summary: Create a new event (Admin)
     *     tags: [Events]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateEventRequest'
     *     responses:
     *       200:
     *         description: Event created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid request payload
     *       401:
     *         description: Unauthorized - Admin authentication required
     */
    router.post("/", adminAuth, (req, res) => eventsController.createEvent(req, res));

    /**
     * @swagger
     * /events/{id}:
     *   put:
     *     summary: Update an event (Admin)
     *     tags: [Events]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Event ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateEventRequest'
     *     responses:
     *       200:
     *         description: Event updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid request payload or event ID
     *       401:
     *         description: Unauthorized - Admin authentication required
     *       404:
     *         description: Event not found
     */
    router.put("/:id", adminAuth, (req, res) => eventsController.updateEvent(req, res));

    /**
     * @swagger
     * /events/{id}:
     *   delete:
     *     summary: Delete an event (Admin)
     *     tags: [Events]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Event ID
     *     responses:
     *       200:
     *         description: Event deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid event ID
     *       401:
     *         description: Unauthorized - Admin authentication required
     *       404:
     *         description: Event not found
     */
    router.delete("/:id", adminAuth, (req, res) => eventsController.deleteEvent(req, res));

    /**
     * @swagger
     * /events/{id}/draft:
     *   patch:
     *     summary: Set event status to DRAFT (Admin)
     *     tags: [Events]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Event ID
     *     responses:
     *       200:
     *         description: Event status updated to DRAFT
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid event ID
     *       401:
     *         description: Unauthorized - Admin authentication required
     *       404:
     *         description: Event not found
     */
    router.patch("/:id/draft", adminAuth, (req, res) => eventsController.setEventToDraft(req, res));

    /**
     * @swagger
     * /events/{id}/active:
     *   patch:
     *     summary: Set event status to ACTIVE (Admin)
     *     tags: [Events]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Event ID
     *     responses:
     *       200:
     *         description: Event status updated to ACTIVE
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid event ID
     *       401:
     *         description: Unauthorized - Admin authentication required
     *       404:
     *         description: Event not found
     */
    router.patch("/:id/active", adminAuth, (req, res) => eventsController.setEventToActive(req, res));

    /**
     * @swagger
     * /events/{id}/closed:
     *   patch:
     *     summary: Set event status to CLOSED (Admin)
     *     tags: [Events]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Event ID
     *     responses:
     *       200:
     *         description: Event status updated to CLOSED
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       400:
     *         description: Invalid event ID
     *       401:
     *         description: Unauthorized - Admin authentication required
     *       404:
     *         description: Event not found
     */
    router.patch("/:id/closed", adminAuth, (req, res) => eventsController.setEventToClosed(req, res));

    app.use("/events", router);
}
