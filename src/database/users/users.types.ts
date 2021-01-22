import { Document, Model } from 'mongoose';

export interface IUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    imageUrl: string;
    dateOfEntry?: Date;
    lastUpdated?: Date;
}

export interface IUserDocument extends IUser, Document {
    setLastUpdated: (this: IUserDocument) => Promise<void>;
    sameLastName: (this: IUserDocument) => Promise<Document[]>;
}

export interface IUserModel extends Model<IUserDocument> {
    findAll: (this: IUserModel) => Promise<IUserDocument[]>;
    findByAge: (this: IUserModel, min?: number, max?: number) => Promise<IUserDocument[]>;
}
