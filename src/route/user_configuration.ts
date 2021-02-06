import { Router } from 'express';
import { getUserConfigurationById, updateUserConfiguration } from '../controllers/user_configurations';
import { verifyToken } from '../middlewares/authentication';

const userConfigurationRouter = Router();

userConfigurationRouter.put('/users/:id/configuration', verifyToken, updateUserConfiguration);
userConfigurationRouter.get('/users/:id/configuration', verifyToken, getUserConfigurationById);

export default userConfigurationRouter;
