import { Router } from 'express';
import {
    createComment,
    createChildComment,
    viewComments,
    viewCommentsById,
    updateComment,
    updateChildComment,
    deleteComment,
    deleteChildComment,
} from '../controllers/comments';
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

videoRouter.post('/videos/:id/comments', verifyToken, createComment);
videoRouter.post('/videos/:id/comments/:comment_id', verifyToken, createChildComment);
videoRouter.get('/videos/:id/comments', viewComments);
videoRouter.get('/videos/:id/comments/:comment_id', viewCommentsById);
videoRouter.put('/videos/:id/comments/:comment_id', verifyToken, updateComment);
videoRouter.put('/videos/:id/comments/:comment_id/childern/:child_id', verifyToken, updateChildComment);
videoRouter.delete('/videos/:id/comments/:comment_id', verifyToken, deleteComment);
videoRouter.delete('/videos/:id/comments/:comment_id/childern/:child_id', verifyToken, deleteChildComment);

export default videoRouter;
