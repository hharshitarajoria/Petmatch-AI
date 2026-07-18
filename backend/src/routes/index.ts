import { Router } from 'express';
import healthRouter from './health.route';
import authRouter from './auth.route';

const router = Router();

// GET /
router.use('/', healthRouter);

// Auth routes
router.use('/auth', authRouter);

export default router;