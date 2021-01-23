import { Router } from 'express';
import { createVideo, deleteVideo, updateVideo, viewVideo } from '../controllers/videos';
import { verifyToken } from '../middlewares/authentication';

const videoRouter = Router();

videoRouter.get('/videos/:id', viewVideo);
videoRouter.post('/videos', verifyToken, createVideo);
videoRouter.put('/videos/:id', verifyToken, updateVideo);
videoRouter.delete('/videos/:id', verifyToken, deleteVideo);

export default videoRouter;
