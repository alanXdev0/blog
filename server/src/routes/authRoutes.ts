import { Router } from 'express';
import { loginHandler, loginValidators, logoutHandler, meHandler } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/login', loginValidators, loginHandler);
authRouter.post('/logout', logoutHandler);
authRouter.get('/me', requireAuth, meHandler);

export default authRouter;
