import { model } from 'mongoose';
import { IPlaylistDocument } from './playlists.types';
import { PlaylistSchema } from './playlists.schema';

export const PlaylistModel = model<IPlaylistDocument>('playlist', PlaylistSchema);
