import express from "express";
import cookieParser from "cookie-parser";
import 'dotenv/config';

import { connect } from "./src/database/database";
import userRouter from "./src/route/users";
import authRouter from "./src/route/auth";
import videoRouter from "./src/route/videos";
import playlistRouter from "./src/route/playlist";
import userConfigurationRouter from "./src/route/user_configuration";

const app = express();
connect();

app.use(cookieParser());
app.use(userRouter);
app.use(authRouter);
app.use(videoRouter);
app.use(playlistRouter);
app.use(userConfigurationRouter);

app.listen(3000, () => {
    console.log('app listen at localhost:3000');
})
