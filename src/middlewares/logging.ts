import type { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logging';

export async function logRequest(request: Request, _: Response, next: NextFunction): Promise<void | Response> {
    logger.info('access from ip ' + request.ip);
    next();
}
