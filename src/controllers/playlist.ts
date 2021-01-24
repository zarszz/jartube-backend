import { Request, Response } from 'express';
import { Fields, IncomingForm } from 'formidable';
import { PlaylistModel } from '../database/playlists/playlists.model';
import { IPlaylist, IPlaylistDocument } from '../database/playlists/playlists.types';
import { UserModel } from '../database/users/users.model';

export async function createPlaylist(req: Request, res: Response): Promise<void> {
    const { userID } = req.params;

    const form = new IncomingForm();

    form.parse(
        req,
        async (err: Error, fields: Fields): Promise<Response> => {
            try {
                if (err) throw err;

                const { name, description } = fields;

                if (!name && !description) throw new Error('Name and description are required !!');
                if (!(await UserModel.findById(userID))) throw new Error('User not found !!');

                // Create playlist object and put into database
                const playlist = <IPlaylist>{ owner: userID, name, description, videos: [] };
                const data = <IPlaylistDocument>await PlaylistModel.create(playlist);

                return res.status(200).send({ status: 'Success', data });
            } catch (error) {
                if (error instanceof Error) return res.status(400).send({ status: 'Failed', message: error.message });
                return res.status(500).send({ status: 'Error', error });
            }
        },
    );
}

export async function addVideoToPlaylist(req: Request, res: Response): Promise<Response> {
    try {
        const { id, videoID } = req.params;

        const playlist = <IPlaylistDocument>await PlaylistModel.findById(id);

        if (playlist.videos.includes(videoID)) throw new Error('Video is already in playlist !!');

        playlist.videos.push(videoID);
        playlist.save();

        return res.status(200).send({ status: 'Success' });
    } catch (error) {
        if (error instanceof Error) return res.status(400).send({ status: 'Failed', message: error.message });
        return res.status(500).send({ status: 'Error', error });
    }
}

export async function viewPlaylist(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;
        const data = <IPlaylistDocument>await PlaylistModel.findById(id);
        return res.status(200).send({ Status: 'Success', data });
    } catch (error) {
        if (error instanceof Error) return res.status(400).send({ status: 'Failed', message: error.message });
        return res.status(500).send({ status: 'Error', error });
    }
}

export async function viewUserPlaylists(req: Request, res: Response): Promise<Response> {
    try {
        const { userID } = req.params;
        const data = <IPlaylistDocument[]>await PlaylistModel.find({ owner: userID });
        return res.status(200).send({ Status: 'Success', data });
    } catch (error) {
        if (error instanceof Error) return res.status(400).send({ status: 'Failed', message: error.message });
        return res.status(500).send({ status: 'Error', error });
    }
}

export async function updatePlaylist(req: Request, res: Response): Promise<void> {
    const { userID, id } = req.params;

    const form = new IncomingForm();

    form.parse(
        req,
        async (err: Error, fields: Fields): Promise<Response> => {
            try {
                if (err) throw err;

                const { name, description } = fields;

                if (!name && !description) throw new Error('Name and description are required !!');
                if (!(await UserModel.findById(userID))) throw new Error('User not found !!');
                if (!(await PlaylistModel.findById(id))) throw new Error('Playlist not found !!');

                // Update playlist object and put into database
                const playlist = <IPlaylistDocument>{ owner: userID, name, description };
                const data = <IPlaylistDocument>(
                    await PlaylistModel.findOneAndUpdate({ _id: id }, playlist, { useFindAndModify: false, new: true })
                );

                return res.status(200).send({ status: 'Success', data });
            } catch (error) {
                if (error instanceof Error) return res.status(400).send({ status: 'Failed', message: error.message });
                return res.status(500).send({ status: 'Error', error });
            }
        },
    );
}

export async function deletePlaylist(req: Request, res: Response): Promise<Response> {
    try {
        const { userID, id } = req.params;

        if (!(await UserModel.findById(userID))) throw new Error('User not found !!');
        if (!(await PlaylistModel.findById(id))) throw new Error('Playlist not found !!');

        await PlaylistModel.deleteOne({ _id: id });

        return res.status(200).send({ status: 'Success' });
    } catch (error) {
        if (error instanceof Error) return res.status(400).send({ status: 'Failed', message: error.message });
        return res.status(500).send({ status: 'Error', error });
    }
}

export async function deleteVideoFromPlaylist(req: Request, res: Response): Promise<Response> {
    try {
        const { id, videoID } = req.params;

        const playlist = <IPlaylistDocument>await PlaylistModel.findById(id);

        if (!playlist.videos.includes(videoID)) throw new Error('Video is not in playlist !!');

        playlist.videos = playlist.videos.filter((curr) => {
            return curr !== videoID;
        });
        playlist.save();

        return res.status(200).send({ status: 'Success' });
    } catch (error) {
        if (error instanceof Error) return res.status(400).send({ status: 'Failed', message: error.message });
        return res.status(500).send({ status: 'Error', error });
    }
}
