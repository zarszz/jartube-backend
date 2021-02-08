import type { Request, Response } from 'express';
import { Fields, IncomingForm } from 'formidable';
import { IComments, ICommentsChildDocument, ICommentsDocument } from '../database/comments/comments.types';
import { VideoModel } from '../database/videos/videos.model';
import { CommentModel } from '../database/comments/comments.model';
import { IVideoDocument } from '../database/videos/videos.types';

export function createComment(req: Request, res: Response): void {
    const form = new IncomingForm();
    form.parse(
        req,
        async (err: Error, fields: Fields): Promise<Response> => {
            try {
                if (err) throw new Error(err.message);

                const { id } = req.params;

                if (!req.cookies['user']) throw new Error('You are not authorize to perform this action !!');
                if (!(await VideoModel.findById(id))) throw new Error('Video not found !!');

                const user = req.cookies['user'] as string;
                const comment = <IComments>{
                    content: fields.content as string,
                    owner: user,
                    video: id,
                };
                const data = <ICommentsDocument>await CommentModel.create(comment);
                return res.status(200).send({ status: 'Success', data });
            } catch (error) {
                return res.status(400).send({ status: 'Error', message: error.message });
            }
        },
    );
}

export function createChildComment(req: Request, res: Response): void {
    const form = new IncomingForm();
    form.parse(
        req,
        async (err: Error, fields: Fields): Promise<Response> => {
            try {
                if (err) throw new Error(err.message);

                const { id, comment_id } = req.params;

                if (!req.cookies['user']) throw new Error('You are not authorize to perform this action !!');
                if (!(await VideoModel.findById(id))) throw new Error('Video not found !!');

                const user = req.cookies['user'] as string;
                const comment = <ICommentsDocument>await CommentModel.findById(comment_id);
                const child = <ICommentsChildDocument>{
                    content: fields.content as string,
                    owner: user,
                    video: id,
                };
                comment.childern.push(child);
                comment.save();
                return res.status(200).send({ status: 'Success', data: comment });
            } catch (error) {
                return res.status(400).send({ status: 'Error', message: error.message });
            }
        },
    );
}

export async function viewComments(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;

        if (!(await VideoModel.findById(id))) throw new Error('Video not found !!');

        const comments = <ICommentsDocument[]>await CommentModel.find({ video: id });

        return res.status(200).send({ status: 'Success', data: comments });
    } catch (error) {
        return res.status(400).send({ status: 'Error', message: error.message });
    }
}

export async function viewCommentsById(req: Request, res: Response): Promise<Response> {
    try {
        const { id, comment_id } = req.params;

        const video = <IVideoDocument>await VideoModel.findById(id);
        if (!video) throw new Error('Video not found !!');

        const data = <ICommentsDocument>await CommentModel.findById(comment_id);
        if (video.id !== data.video) throw new Error('Comment not found !!');

        return res.status(200).send({ status: 'Success', data });
    } catch (error) {
        return res.status(400).send({ status: 'Error', message: error.message });
    }
}

export async function updateComment(req: Request, res: Response): Promise<void> {
    const form = new IncomingForm();

    form.parse(
        req,
        async (err: Error, fields: Fields): Promise<Response> => {
            try {
                if (err) throw new Error(err.message);

                const { content } = fields;
                const { id, comment_id } = req.params;

                const video = <IVideoDocument>await VideoModel.findById(id);
                if (!video) throw new Error('Video not found !!');

                const comment = <ICommentsDocument>await CommentModel.findById(comment_id);
                if (!comment) throw new Error('Comment not found !!');

                const data = <ICommentsDocument>(
                    await CommentModel.findOneAndUpdate(
                        { _id: comment_id },
                        { content: (content as string) || comment.content },
                        { useFindAndModify: false, new: true },
                    )
                );

                return res.status(200).send({ message: 'Success', data });
            } catch (error) {
                return res.status(400).send({ status: 'Error', message: error.message });
            }
        },
    );
}

export async function updateChildComment(req: Request, res: Response): Promise<void> {
    const form = new IncomingForm();

    form.parse(
        req,
        async (err: Error, fields: Fields): Promise<Response | void> => {
            try {
                if (err) throw new Error(err.message);

                const { content } = fields;
                const { id, comment_id, child_id } = req.params;

                const video = <IVideoDocument>await VideoModel.findById(id);
                if (!video) throw new Error('Video not found !!');

                const comment = <ICommentsDocument>await CommentModel.findById(comment_id);
                if (!comment) throw new Error('Comment not found !!');

                const index = comment.childern.findIndex((comment) => comment.id === child_id);
                if (index === -1) throw new Error('Comment not found !!');

                const old_content = comment.childern[index].content;

                comment.childern[index].content = (content as string) || (old_content as string);
                comment.save((error, data) => {
                    if (error) throw new Error(error.message);
                    return res.status(200).send({ message: 'Success', data });
                });
            } catch (error) {
                return res.status(400).send({ status: 'Error', message: error.message });
            }
        },
    );
}

export async function deleteComment(req: Request, res: Response): Promise<Response> {
    try {
        const { id, comment_id } = req.params;

        if (!(await VideoModel.findById(id))) throw new Error('Video not found !!');
        if (!(await CommentModel.findById(comment_id))) throw new Error('Comment not found !!');

        await CommentModel.deleteOne({ _id: comment_id });

        return res.status(200).send({ status: 'Success' });
    } catch (error) {
        return res.status(400).send({ status: 'Error', message: error.message });
    }
}

export async function deleteChildComment(req: Request, res: Response): Promise<Response | void> {
    try {
        const { id, comment_id, child_id } = req.params;

        const video = <IVideoDocument>await VideoModel.findById(id);
        if (!video) throw new Error('Video not found !!');

        const comment = <ICommentsDocument>await CommentModel.findById(comment_id);
        if (!comment) throw new Error('Comment not found !!');

        const index = comment.childern.findIndex((comment) => comment.id === child_id);
        if (index === -1) throw new Error('Comment not found !!');

        comment.childern.splice(index, 1);

        comment.save((error, data) => {
            if (error) throw new Error(error.message);
            return res.status(200).send({ message: 'Success', data });
        });
    } catch (error) {
        return res.status(400).send({ status: 'Error', message: error.message });
    }
}
