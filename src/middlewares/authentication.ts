import type { NextFunction, Request, Response } from 'express';

import { validateJWT } from '../utils/auth.util';

export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    type map_string = { [key: string]: string };

    const bearer = req.header("token")!;
    const token = bearer.split(' ')[1];
    if (!token) throw new Error("No token provided !!");

    try {
        const verified_token = await validateJWT(token as string) as map_string;
        if (!verified_token['id']) throw new Error('Invalid token !!!');
        next()
    } catch (error) {
        if (error instanceof Error) return res.send({ status: 'Failed', message: error.message }).status(400);
        return res.send({ status: 'Error', error }).status(500);
    }


}