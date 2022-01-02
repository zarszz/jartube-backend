import * as amqplib from 'amqplib';
import { config } from '../config';

const queueName = config.QUEUE.QUEUE_NAME!;
const url = config.QUEUE.QUEUE_URL!;

const queue = amqplib.connect(url);

export async function send(data: Buffer, filename: string): Promise<void> {
    const channel = (await queue).createChannel();
    const properties = { headers: { filename }, timestamp: Date.now() };
    (await channel).assertQueue(queueName, { durable: true });
    (await channel).sendToQueue(queueName, data, properties);
    (await channel).close();
}
