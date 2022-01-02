import dotenv from 'dotenv';
import path from 'path';

const ENV_PATH = path.join(__dirname, '../../.env');

process.env.NODE_ENV !== 'DEVELOPMENT' ? false : dotenv.config({ path: ENV_PATH });

export const config = {
    BUCKET: {
        S3_SECRET: process.env.S3_SECRET,
        S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
        S3_SESSION_TOKEN: process.env.S3_SESSION_TOKEN,
        S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    },
    DB: {
        MONGODB_URI: process.env.MONGODB_URI,
        MONGO_INITDB_DATABASE: process.env.MONGO_INITDB_DATABASE,
        MONGO_INITDB_ROOT_USERNAME: process.env.MONGO_INITDB_ROOT_USERNAME,
        MONGO_INITDB_ROOT_PASSWORD: process.env.MONGO_INITDB_ROOT_PASSWORD,
    },
    QUEUE: {
        USING_QUEUE: process.env.USING_QUEUE,
        QUEUE_URL: process.env.QUEUE_URL,
        QUEUE_NAME: process.env.QUEUE_NAME,
    },
    URI: {
        CONTENTS_LOCATION: process.env.CONTENTS_LOCATION,
    },
};
