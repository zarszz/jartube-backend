import { Document, Model } from 'mongoose';

export interface IVideo {
    owner: string;
    title: string;
    description: string;
    slug: string;
    videoUrl: string;
    like: number;
    dislike: number;
    viewed: number;
}

export interface IVideoDocument extends IVideo, Document {}

export type IVideoModel = Model<IVideoDocument>;
