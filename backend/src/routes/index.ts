import { Router } from 'express';
import healthRouter from './health.route';
import authRouter from './auth.route';
import petRouter from './pet.route';
import speciesRouter from './species.route';
const router = Router();

router.use('/', healthRouter);

router.use('/auth', authRouter);

router.use('/pets', petRouter);



router.use('/species', speciesRouter);


export default router;