import { model } from 'mongoose';
import { ICommentsDocument } from './comments.types';
import { CommentSchema } from './comments.schema';

export const CommentModel = model<ICommentsDocument>('comment', CommentSchema);
