import { Router } from 'express';
import { login, register } from '../controllers/authentication';

const authRouter = Router();

authRouter.post('/auth/login', login);
authRouter.post('/auth/register', register);

export default authRouter;
