import { Schema } from 'mongoose';

export const VideoSchema = new Schema({
    owner: String,
    description: String,
    title: {
        type: String,
        unique: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    videoUrl: {
        type: String,
        unique: true,
    },
    like: {
        type: Number,
        default: 0,
    },
    dislike: {
        type: Number,
        default: 0,
    },
    viewed: {
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
});

export default VideoSchema;
