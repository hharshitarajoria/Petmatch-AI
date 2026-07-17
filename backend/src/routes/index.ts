import { Router } from 'express';
import healthRouter from './health.route';

const router = Router();

// GET /  -> health check
router.use('/', healthRouter);

// Future routers (pets, auth, matching, etc.) will be mounted here, e.g.:
// router.use('/pets', petRouter);

export default router;
