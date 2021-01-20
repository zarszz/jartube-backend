import { UserModel } from '../database/users/users.model';
import { hash, compare, genSalt } from "bcrypt";

/**
 * Check existence of user id
 * 
 * @param user_id 
 */
export async function isUserExist(user_id: string): Promise<boolean> {
    const counted_user: number = await UserModel.countDocuments({ _id: user_id });
    return counted_user > 0;
}
/**
 * Hash a password with bcrypt method
 * 
 * @param plainPassword 
 */
export async function hashPassword(plainPassword: string): Promise<string> {
    const salt = await genSalt(15);
    return hash(plainPassword, salt);
}

/**
 * Compare a plain text and encrypted password
 * 
 * @param plainPassword 
 * @param hashedPassword 
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return compare(plainPassword, hashedPassword);
}
