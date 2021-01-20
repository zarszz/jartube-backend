import { Schema } from 'mongoose';
// import { findAll, findByAge } from './users.statics';
// import { setLastUpdated, sameLastName } from './users.methods';

export const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
    },
    password: String,
    firstName: String,
    lastName: String,
    birthDate: Date,
    imageUrl: String,
    dateOfEntry: {
        type: Date,
        default: new Date(),
    },
    lastUpdated: {
        type: Date,
        default: new Date(),
    },
});

// UserSchema.statics.findByAge = findByAge;
// UserSchema.statics.findAll = findAll;

// UserSchema.methods.setLastUpdated = setLastUpdated;
// UserSchema.methods.sameLastName = sameLastName;

export default UserSchema;
