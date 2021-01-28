import { Document, Model } from 'mongoose';

export interface IPlaylist {
    owner: string;
    name: string;
    description: string;
    videos: string[];
}

export interface IPlaylistDocument extends IPlaylist, Document {}

export type IPlaylistModel = Model<IPlaylistDocument>;
