import mongoose from 'mongoose';
import 'dotenv/config';

let database: mongoose.Connection;

export function connect() {
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

    database.on('error', async () => {
        console.error('Error when connecting to database');
    });
}

export function disconnect() {
    if (!database) return;
    mongoose.disconnect();
}
