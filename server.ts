import express from "express";
import 'dotenv/config';

import { register } from "./src/route/users";
import { connect } from "./src/database/database";

const app = express();
connect();

app.post('/register', register);

app.listen(3000, () => {
    console.log('app listen at localhost:3000');
})
