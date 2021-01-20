import express from "express";
import 'dotenv/config';

import { register, update, getUserByID, getUsers, deleteUser, login } from "./src/route/users";
import { connect } from "./src/database/database";
import { verifyToken } from "./src/middlewares/authentication";

const app = express();
connect();

app.post('/auth/register', register);
app.put('/users/:id',verifyToken, update);
app.get('/users/:id', verifyToken, getUserByID);
app.get( '/users', verifyToken, getUsers);
app.delete('/users/:id', verifyToken, deleteUser);

app.post('/auth/login', login);

app.listen(3000, () => {
    console.log('app listen at localhost:3000');
})
