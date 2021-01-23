import type { NextFunction, Request, Response } from 'express';

import { validateJWT } from '../utils/auth.util';

export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    const bearer = req.header('token')!;
    if (!bearer) throw new Error('No token provided !!');
    const token = bearer.split(' ')[1];

    try {
        const verified_token = await validateJWT(token as string);
        if (!verified_token['id']) throw new Error('Invalid token !!!');
        next();
    } catch (error) {
        if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
        return res.send({ status: 'Error', error }).status(500);
    }
}
