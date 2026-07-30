import { Router } from "express";
import { getHealth } from "../controllers/health.controller";

const healthRouter = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health Check
 *     description: Returns the current health status of the PetMatch AI backend.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is running successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Server is running
 */
healthRouter.get("/", getHealth);

export default healthRouter;