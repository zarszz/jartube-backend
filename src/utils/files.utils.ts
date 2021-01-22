import type { File } from 'formidable';

/**
 * Validate video mime type file
 *
 * @param file
 */
export function validateVideo(file: File): boolean {
    const valid_type = ['video/x-msvideo', 'video/mpeg', 'video/webm', 'video/3gpp', 'video/mp4'];
    return valid_type.includes(file.type);
}

/**
 * Remove white space from file name and replace with underscore(_)
 *
 * @param fileName
 */
export function removeWhiteSpace(fileName: string): string {
    return fileName.replace(/\s/g, '_');
}
