import { sign, verify } from "jsonwebtoken";
import { readFileSync } from "fs";
import { resolve } from "path";

const privateKey = readFileSync(resolve(__dirname, '../../private.pem'));
const publicKey = readFileSync(resolve(__dirname, '../../public.pem'));

/**
 * Generate a new JWT key
 * 
 * @param id 
 */
export async function generateJWT(id: string): Promise<string> {
    return sign({id}, privateKey, { expiresIn: '2h', algorithm: 'RS256' });
}

/**
 * Verify a token
 * 
 * @param token 
 */
export async function validateJWT(token: string): Promise<object> {
    return verify(token, publicKey, {algorithms: ['RS256']}) as object;
}
