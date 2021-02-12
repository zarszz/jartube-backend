import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { connect } from './database/database';
import userRouter from './route/users';
import authRouter from './route/auth';
import videoRouter from './route/videos';
import playlistRouter from './route/playlist';
import userConfigurationRouter from './route/user_configuration';

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
});
