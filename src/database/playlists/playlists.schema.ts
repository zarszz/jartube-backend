import { Schema } from 'mongoose';

export const PlaylistSchema = new Schema({
    owner: {
        type: String,
        unique: true
    },
    name: String,
    description: String,
    videos: [String],
    dateOfEntry: {
        type: Date,
        default: new Date(),
    },
    lastUpdated: {
        type: Date,
        default: new Date(),
    },
});

export default PlaylistSchema;
