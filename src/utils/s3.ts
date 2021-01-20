import type { PutObjectOutput } from 'aws-sdk/clients/s3';
import type { ReadStream } from 'fs';

import AWS from 'aws-sdk';

export const S3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET!,
    sessionToken: process.env.S3_SESSION_TOKEN!,
});

export async function put_object(data: Buffer | ReadStream, filename: string): Promise<PutObjectOutput> {
    return S3.putObject({
        Key: filename,
        Body: data,
        Bucket: String(process.env.S3_BUCKET_NAME!),
        ACL: 'public-read',
    }).promise();
}
