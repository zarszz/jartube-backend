import type { Request, Response } from 'express';
import type { ReadStream } from 'fs';
import type { Fields, Files } from 'formidable';

import { IncomingForm } from 'formidable';
import { createReadStream } from 'fs';

import { put_object } from '../utils/s3';
import { REGISTER_KEY } from '../constant/valid_keys';
import { IUser, IUserDocument } from '../database/users/users.types';
import { UserModel } from '../database/users/users.model';
import { hashPassword, isUserExist } from '../utils/users.util';
import { IUserConfigurationDocument } from '../database/user_configuration/user_configuration.types';
import { UserConfigurationModel } from '../database/user_configuration/user_configuration.model';
import { logger } from '../utils/logging';

export function update(req: Request, res: Response): void {
    const formidable = new IncomingForm();

    formidable.parse(
        req,
        async (err: string, fields: Fields, files: Files): Promise<Response> => {
            try {
                const { id } = req.params;

                if (!(await isUserExist(id))) throw new Error(`$User not found !!`);

                if (err) throw new Error(err);
                REGISTER_KEY.forEach((key: string) => {
                    if (!fields[key]) throw new Error(`${key} is required !`);
                });

                const { email, password, firstName, lastName, birthDate } = fields;

                if (files.file) {
                    const data: ReadStream = createReadStream(files.file.path);
                    await put_object(data, files.file.name);
                }

                // Generate hashed password
                const hashedPassword = await hashPassword(password as string);

                const old_data = <IUser>await UserModel.findById(id);

                const imageUrl = files.file
                    ? `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${files.file.name}`
                    : old_data.imageUrl;

                const user: IUser = {
                    email: String(email) || old_data.email,
                    password: hashedPassword || old_data.password,
                    firstName: String(firstName) || old_data.firstName,
                    lastName: String(lastName) || old_data.lastName,
                    birthDate: new Date(String(birthDate)) || old_data.birthDate,
                    imageUrl,
                };

                const result = await UserModel.updateOne({ _id: id }, user).select({ password: 0 });

                return res.send({ status: 'Success', result }).status(200);
            } catch (error) {
                logger.error(error);
                if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
                return res.send({ status: 'Error', error }).status(500);
            }
        },
    );
}

export async function getUserByID(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;

        if (!(await isUserExist(id))) throw new Error(`$User not found !!`);

        const user = <IUserDocument>await UserModel.findOne({ _id: id }).select({ password: 0 });
        const user_configuration = <IUserConfigurationDocument>await UserConfigurationModel.findOne({ owner: user.id });
        return res
            .send({
                status: 'Success',
                data: {
                    user,
                    user_configuration,
                },
            })
            .status(200);
    } catch (error) {
        logger.error(error);
        if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
        return res.send({ status: 'Error', error }).status(500);
    }
}

export async function getUsers(_: Request, res: Response): Promise<Response> {
    try {
        const users: IUser[] = await UserModel.find({}).select({ password: 0 });
        return res.send({ status: 'Success', users }).status(200);
    } catch (error) {
        logger.error(error);
        if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
        return res.send({ status: 'Error', error }).status(500);
    }
}

export async function deleteUser(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;
        await UserModel.deleteOne({ _id: id });
        return res.send({ status: 'Success' }).status(200);
    } catch (error) {
        logger.error(error);
        if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
        return res.send({ status: 'Error', error }).status(500);
    }
}
