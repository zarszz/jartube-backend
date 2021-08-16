import type { Request, Response } from 'express';
import { Fields, IncomingForm } from 'formidable';
import { UserConfigurationModel } from '../database/user_configuration/user_configuration.model';
import {
    IUserConfiguration,
    IUserConfigurationDocument,
} from '../database/user_configuration/user_configuration.types';
import { logger } from '../utils/logging';
import { isUserExist } from '../utils/users.util';

export async function getUserConfigurationById(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;

        if (!(await isUserExist(id))) throw new Error(`$User not found !!`);

        const configuration = <IUserConfigurationDocument>await UserConfigurationModel.findOne({ owner: id });

        return res.send({ status: 'Success', configuration }).status(200);
    } catch (error) {
        logger.error(error);
        if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
        return res.send({ status: 'Error', error }).status(500);
    }
}

export async function updateUserConfiguration(req: Request, res: Response): Promise<void> {
    const form = new IncomingForm();
    form.parse(req, async (err: Error, fields: Fields) => {
        if (err) throw new Error(err.message);
        const { id } = req.params;
        const {
            theme,
            language,
            location,
            notification,
            subscription,
            recommendation,
            channel_activity,
            comments_activity,
            tagged,
            shared_content,
        } = fields;
        try {
            if (!(await UserConfigurationModel.findOne({ owner: id as string }))) throw new Error('User not found !!');
            const old_data = <IUserConfigurationDocument>await UserConfigurationModel.findOne({ owner: id as string });
            const configuration = <IUserConfiguration>{
                theme: theme || old_data.theme,
                language: language || old_data.language,
                location: location || old_data.location,
                notification: notification || old_data.notification,
                preferences: {
                    subscription: subscription || old_data.preferences.subscription,
                    recommendation: recommendation || old_data.preferences.recommendation,
                    channel_activity: channel_activity || old_data.preferences.channel_activity,
                    comments_activity: comments_activity || old_data.preferences.comments_activity,
                    tagged: tagged || old_data.preferences.tagged,
                    shared_content: shared_content || old_data.preferences.shared_content,
                },
            };
            const result = <IUserConfigurationDocument>await UserConfigurationModel.findOneAndUpdate(
                { owner: id },
                configuration,
                {
                    useFindAndModify: false,
                    new: true,
                },
            );
            return res.status(200).send({ status: 'Success', result });
        } catch (error) {
            logger.error(error);
            if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
            return res.send({ status: 'Error', error }).status(500);
        }
    });
}
