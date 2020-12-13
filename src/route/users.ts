import type { Request, Response } from 'express';

import { put_object } from '../utils/s3';
import { REGISTER_KEY } from '../constant/valid_keys';
import { IUser } from '../database/users/users.types';
import { UserModel } from '../database/users/users.model';

import Formidable from 'formidable';
import fs from 'fs';

export function register(req: Request, res: Response): void {
    const formidable = new Formidable.IncomingForm();

    formidable.parse(
        req,
        async (err: string, fields: Formidable.Fields, files: Formidable.Files): Promise<Response> => {
            try {
                if (err) throw new Error(err);
                REGISTER_KEY.forEach((key: string) => {
                    if (!fields[key]) throw new Error(`${key} is required !`);
                });

                const { email, password, firstName, lastName, age, birthDate } = fields;
                const data: fs.ReadStream = fs.createReadStream(files.file!.path);
                await put_object(data, files.file!.name);
                const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${files.file!.name}`;

                const user: IUser = {
                    email: String(email),
                    password: String(password),
                    firstName: String(firstName),
                    lastName: String(lastName),
                    age: Number(age),
                    birthDate: new Date(String(birthDate)),
                    imageUrl,
                };

                const result = await UserModel.create(user);

                return res.send({ status: 'Success', result }).status(200);
            } catch (error) {
                if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
                return res.send({ status: 'Error', error }).status(500);
            }
        },
    );
}
