import { Document, Model } from 'mongoose';

export interface IUserConfiguration {
    owner: string;
    theme: string;
    language: string;
    location: string;
    notification: boolean;
    preferences: {
        subscription: boolean;
        recommendation: boolean;
        channel_activity: boolean;
        comments_activity: boolean;
        tagged: boolean;
        shared_content: boolean;
    };
}

export interface IUserConfigurationDocument extends IUserConfiguration, Document {}

export type IUserConfigurationModel = Model<IUserConfigurationDocument>;
