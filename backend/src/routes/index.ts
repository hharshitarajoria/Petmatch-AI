import { Router } from 'express';
import healthRouter from './health.route';
import authRouter from './auth.route';
import petRouter from './pet.route';
import speciesRouter from './species.route';
import breedRouter from './breed.route';
import userPreferenceRouter from './userPreference.route';
import recommendationRouter from './recommendation.route';
import savedPetRouter from './savedPet.route';
import adoptionRequestRouter from './adoptionRequest.route';
import conversationRouter from './conversation.route';
import messageRouter from './message.route';
import notificationRouter from './notification.route';
import reportRouter from './report.route';
import chatHistoryRouter from "./chatHistory.route";

const router = Router();

router.use('/', healthRouter);

router.use('/auth', authRouter);

router.use('/pets', petRouter);

router.use('/species', speciesRouter);

router.use('/breeds', breedRouter);

router.use('/preferences', userPreferenceRouter);

router.use('/recommendations', recommendationRouter);

router.use('/saved-pets', savedPetRouter);

router.use('/adoption-requests', adoptionRequestRouter);

router.use('/conversations', conversationRouter);

router.use('/messages', messageRouter);

router.use('/notifications', notificationRouter);

router.use("/chat-history", chatHistoryRouter);

router.use('/reports', reportRouter);
export default router;