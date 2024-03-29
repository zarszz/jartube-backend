import type { Request, Response } from 'express';
import { createReadStream } from 'fs';
import type { ReadStream } from 'fs';

import { Fields, Files, IncomingForm } from 'formidable';
import { VIDEO_KEY } from '../constant/valid_keys';
import { IVideo, IVideoDocument } from '../database/videos/videos.types';
import { delete_object, put_object } from '../utils/s3';
import { VideoModel } from '../database/videos/videos.model';
import { removeWhiteSpace, validateVideo } from '../utils/files.utils';
import { validateJWT } from '../utils/auth.util';
import { authorizeVideo } from '../utils/video.auth.util';
import { logger } from '../utils/logging';
import { send } from '../utils/queue.util';

export async function createVideo(req: Request, res: Response): Promise<void> {
    const form = new IncomingForm();
    form.parse(
        req,
        async (err: Error, fields: Fields, files: Files): Promise<Response> => {
            try {
                if (err) throw new Error(err.message);

                // Get user id based on jwt token
                const token = req.header('token')!.split(' ')[1];
                const owner = (await validateJWT(token))['id'];

                // Validate request body
                VIDEO_KEY.forEach((key) => {
                    if (!fields[key]) throw new Error(`${key} is required !!`);
                });

                // Validate video existance and mime-type
                if (!files['video']) throw new Error('Video is require !!');
                if (!validateVideo(files['video'])) throw new Error('File type is not supported');

                files['video'].name = removeWhiteSpace(files['video'].name);

                const videoUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${files['video'].name}`;

                // Create video object
                const { title, description, slug } = fields;

                const video = <IVideo>{
                    owner,
                    title,
                    description,
                    slug,
                    like: 0,
                    dislike: 0,
                    viewed: 0,
                    videoUrl,
                };

                // Put to database
                const data = <IVideoDocument>await VideoModel.create(video);

                // Upload to S3 storage
                const stream: ReadStream = createReadStream(files['video'].path);
                if (process.env.USING_QUEUE) {
                    const chunks = [];
                    for await (const chunk of stream) {
                        chunks.push(chunk);
                    }
                    send(Buffer.concat(chunks), files['video'].name);
                } else {
                    // put_object(stream, files['video'].name);
                }

                return res.status(200).send({ status: 'Success', data });
            } catch (error) {
                logger.error(error);
                if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
                return res.send({ status: 'Error', error }).status(500);
            }
        },
    );
}

export async function viewVideos(_: Request, res: Response): Promise<Response> {
    try {
        const data: IVideoDocument[] = await VideoModel.find({});
        return res.status(200).send({ status: 'Success', data });
    } catch (error) {
        logger.error(error);
        if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
        return res.send({ status: 'Error', error }).status(500);
    }
}

export async function viewRandomVideo(_: Request, res: Response): Promise<Response> {
    try {
        const data = <IVideoDocument[]>await VideoModel.aggregate([{ $sample: { size: 1 } }]);
        return res.status(200).send({ status: 'Success', data });
    } catch (error) {
        logger.error(error);
        if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
        return res.send({ status: 'Error', error }).status(500);
    }
}

export async function viewVideo(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;

        const video = <IVideoDocument>await VideoModel.findById(id);

        video.viewed = video.viewed + 1;
        await video.save();

        return res.status(200).send({ status: 'Success', video });
    } catch (error) {
        logger.error(error);
        if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
        return res.send({ status: 'Error', error }).status(500);
    }
}

export async function viewVideoByUser(req: Request, res: Response): Promise<Response> {
    try {
        const { userID } = req.params;

        const video = <IVideoDocument>await VideoModel.findOne({ owner: userID });

        video.viewed = video.viewed + 1;
        await video.save();

        return res.status(200).send({ status: 'Success', video });
    } catch (error) {
        logger.error(error);
        if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
        return res.send({ status: 'Error', error }).status(500);
    }
}

export async function updateVideo(req: Request, res: Response): Promise<void> {
    const form = new IncomingForm();

    form.parse(
        req,
        async (err: Error, fields: Fields, files: Files): Promise<Response> => {
            try {
                if (err) throw new Error(err.message);

                const { id } = req.params;
                if (!id) throw new Error('Id on path is required !!');

                const old_data = <IVideoDocument>await VideoModel.findById(id);

                // Validate video
                const token = req.header('token')!.split(' ')[1];
                if (!(await authorizeVideo(token, old_data)))
                    throw new Error('You are not authorize to perform this action !');

                // Upload to S3 storage if video exist at form
                if (files['video']) {
                    const stream: ReadStream = createReadStream(files['video'].path);
                    put_object(stream, files['video'].name);
                }

                const videoUrl = files['video']
                    ? `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${files.file.name}`
                    : old_data.videoUrl;

                // Create a video object
                const { title, description, slug, like, dislike, viewed } = fields;
                const video = <IVideo>{
                    title: (title as string) || old_data.title,
                    description: (description as string) || old_data.description,
                    slug: (slug as string) || old_data.slug,
                    like: parseInt(like as string) || old_data.like,
                    dislike: parseInt(dislike as string) || old_data.dislike,
                    viewed: parseInt(viewed as string) || old_data.viewed,
                    videoUrl,
                };

                // Update video data
                const data = <IVideoDocument>(
                    await VideoModel.findOneAndUpdate({ _id: id }, video, { useFindAndModify: false, new: true })
                );

                return res.status(200).send({ status: 'Success', data });
            } catch (error) {
                logger.error(error);
                if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
                return res.send({ status: 'Error', error }).status(500);
            }
        },
    );
}

export async function updateLikeVideo(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;

        const video = <IVideoDocument>await VideoModel.findById(id);

        video.like = video.like + 1;
        await video.save();

        return res.status(200).send({ status: 'Success', video });
    } catch (error) {
        logger.error(error);
        if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
        return res.send({ status: 'Error', error }).status(500);
    }
}

export async function updateDislikeVideo(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;

        const video = <IVideoDocument>await VideoModel.findById(id);

        video.dislike = video.dislike + 1;
        await video.save();

        return res.status(200).send({ status: 'Success', video });
    } catch (error) {
        logger.error(error);
        if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
        return res.send({ status: 'Error', error }).status(500);
    }
}

export async function deleteVideo(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;
        const video = <IVideo>await VideoModel.findByIdAndDelete(id);
        const filename = video.videoUrl.split('/')[3];
        await delete_object(filename);
        return res.status(200).send({ status: 'Success' });
    } catch (error) {
        logger.error(error);
        if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
        return res.send({ status: 'Error', error }).status(500);
    }
}
