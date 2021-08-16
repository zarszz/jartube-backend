import { ElasticsearchTransport } from 'winston-elasticsearch';
import { Client } from '@elastic/elasticsearch';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';

const client = new Client({
    node: process.env.ELK_URL ? process.env.ELK_URL : 'http://127.0.0.1:9200',
});

const esTransport = new ElasticsearchTransport({ client });

export const logger = winston.createLogger({
    transports: [esTransport],
});

export const expressLogger = expressWinston.logger({
    transports: [esTransport],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
});
