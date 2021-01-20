import { Router } from 'express';
import { createVideo, deleteVideo, updateVideo } from '../controllers/videos';
import { verifyToken } from '../middlewares/authentication';

const videoRouter = Router();

videoRouter.post('/videos', verifyToken, createVideo);
videoRouter.put('/videos/:id', verifyToken, updateVideo);
videoRouter.delete('/videos/:id', verifyToken, deleteVideo);

export default videoRouter;
