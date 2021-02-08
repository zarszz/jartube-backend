import { Schema } from 'mongoose';

const comment = {
    owner: String,
    video: String,
    content: String,
    like: {
        type: Number,
        default: 0,
    },
    dislike: {
        type: Number,
        default: 0,
    },
    dateOfEntry: {
        type: Date,
        default: new Date(),
    },
    lastUpdated: {
        type: Date,
        default: new Date(),
    },
};

const child = new Schema(comment);

export const CommentSchema = new Schema({
    owner: String,
    video: String,
    content: String,
    like: {
        type: Number,
        default: 0,
    },
    dislike: {
        type: Number,
        default: 0,
    },
    dateOfEntry: {
        type: Date,
        default: new Date(),
    },
    lastUpdated: {
        type: Date,
        default: new Date(),
    },
    childern: [child],
});

export default CommentSchema;
