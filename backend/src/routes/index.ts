import { Router } from 'express';
import healthRouter from './health.route';
import authRouter from './auth.route';
import petRouter from './pet.route';
import speciesRouter from './species.route';
import breedRouter from './breed.route';

const router = Router();

router.use('/', healthRouter);

router.use('/auth', authRouter);

router.use('/pets', petRouter);

router.use('/species', speciesRouter);

router.use('/breeds', breedRouter);


export default router;