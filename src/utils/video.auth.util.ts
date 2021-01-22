import type { IVideoDocument } from '../database/videos/videos.types';
import { validateJWT } from './auth.util';

/**
 * Validate video based on JWT token and video ID
 *
 * @param token
 * @param videoId
 */
export async function authorizeVideo(token: string, video: IVideoDocument): Promise<boolean> {
    const decoded_token = await validateJWT(token);

    return decoded_token['id'] === video.owner;
}
