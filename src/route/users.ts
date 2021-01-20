import { Router } from "express";
import { deleteUser, getUserByID, getUsers, update } from "../controllers/users";
import { verifyToken } from "../middlewares/authentication";

const userRouter = Router();

userRouter.put('/users/:id',verifyToken, update);
userRouter.get('/users/:id', verifyToken, getUserByID);
userRouter.get( '/users', verifyToken, getUsers);
userRouter.delete('/users/:id', verifyToken, deleteUser);

export default userRouter;
