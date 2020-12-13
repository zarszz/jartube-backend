import { IUserDocument, IUserModel } from './users.types';

export async function findAll(this: IUserModel): Promise<IUserDocument[]> {
    return this.find();
}

export async function findByAge(this: IUserModel, min?: number, max?: number): Promise<IUserDocument[]> {
    return this.find({ age: { $gte: min || 0, $lte: max || Infinity } });
}
