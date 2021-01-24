import { Router } from 'express';
import { addVideoToPlaylist, createPlaylist, deletePlaylist, deleteVideoFromPlaylist, updatePlaylist, viewPlaylist, viewUserPlaylists } from '../controllers/playlist';
import { verifyToken } from '../middlewares/authentication';

const playlistRouter = Router();

playlistRouter.post('/user/:userID/playlists', verifyToken, createPlaylist);
playlistRouter.put('/user/:userID/playlists/:id', verifyToken, updatePlaylist);
playlistRouter.delete('/user/:userID/playlists/:id', verifyToken, deletePlaylist);

playlistRouter.post('/playlists/:id/video/:videoID', verifyToken, addVideoToPlaylist);
playlistRouter.get('/playlists/:id', verifyToken, viewPlaylist);
playlistRouter.get('/playlists/user/:userID', verifyToken, viewUserPlaylists);
playlistRouter.delete('/playlists/:id/video/:videoID', verifyToken, deleteVideoFromPlaylist);



export default playlistRouter;
