import { model } from 'mongoose';
import { IVideoDocument } from './videos.types';
import { VideoSchema } from './videos.schema';

export const VideoModel = model<IVideoDocument>('video', VideoSchema);
