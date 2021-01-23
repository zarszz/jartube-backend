import { Router } from 'express';
import {
    createVideo,
    deleteVideo,
    updateDislikeVideo,
    updateLikeVideo,
    updateVideo,
    viewRandomVideo,
    viewVideo,
    viewVideoByUser,
    viewVideos,
} from '../controllers/videos';
import { verifyToken } from '../middlewares/authentication';

const videoRouter = Router();

videoRouter.get('/videos', viewVideos);
videoRouter.get('/videos/random', viewRandomVideo);
videoRouter.get('/videos/:id', viewVideo);
videoRouter.get('/videos/user/:userID', viewVideoByUser);
videoRouter.post('/videos', verifyToken, createVideo);
videoRouter.put('/videos/:id', verifyToken, updateVideo);
videoRouter.put('/videos/like/:id', verifyToken, updateLikeVideo);
videoRouter.put('/videos/dislike/:id', verifyToken, updateDislikeVideo);
videoRouter.delete('/videos/:id', verifyToken, deleteVideo);

export default videoRouter;
