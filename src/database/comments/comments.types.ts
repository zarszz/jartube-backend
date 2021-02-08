import { Document, Model } from 'mongoose';

export interface Comments {
    owner: string;
    video: string;
    content: string;
    like: number;
    dislike: number;
}

export interface ICommentsChildDocument extends Comments, Document {}

export interface IComments extends Comments {
    childern: ICommentsChildDocument[];
}

export interface ICommentsDocument extends IComments, Document {}

export type ICommentsModel = Model<ICommentsDocument>;
