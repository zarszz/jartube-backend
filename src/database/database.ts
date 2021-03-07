import mongoose from 'mongoose';
import 'dotenv/config';

let database: mongoose.Connection;

export function connect(): void {
    if (database) return;

    mongoose.connect(process.env.MONGODB_URI!, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    database = mongoose.connection;

    database.once('open', async () => {
        console.info('Connected to database');
    });

    database.on('error', async (error: Error) => {
        console.error('Error when connecting to database');
        console.error(`${error.message}`);
    });
}

export function disconnect(): void {
    if (!database) return;
    mongoose.disconnect();
}
