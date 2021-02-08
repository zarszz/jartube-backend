import type { NextFunction, Request, Response } from 'express';

import { validateJWT } from '../utils/auth.util';

export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    const bearer = req.header('token')!;
    if (!bearer) return res.status(400).send({ status: 'Error', message: 'No token provided !!' });
    const token = bearer.split(' ')[1];

    const verified_token = await validateJWT(token as string);
    if (!verified_token['id']) res.status(400).send({ status: 'Error', message: 'Invalid token provided !!' });
    next();
}
