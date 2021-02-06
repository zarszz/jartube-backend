import { Schema } from 'mongoose';

export const UserConfigurationSchema = new Schema({
    owner: String,
    theme: {
        type: String,
        default: 'Light',
    },
    language: {
        type: String,
        default: 'English',
    },
    location: String,
    notification: {
        type: Boolean,
        default: true,
    },
    preferences: {
        subscription: {
            type: Boolean,
            default: true,
        },
        recommendation: {
            type: Boolean,
            default: true,
        },
        channel_activity: {
            type: Boolean,
            default: true,
        },
        comments_activity: {
            type: Boolean,
            default: true,
        },
        tagged: {
            type: Boolean,
            default: true,
        },
        shared_content: {
            type: Boolean,
            default: true,
        },
    },
});

export default UserConfigurationSchema;
