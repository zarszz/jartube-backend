import { Schema, ValidatorProps } from 'mongoose';
// import { findAll, findByAge } from './users.statics';
// import { setLastUpdated, sameLastName } from './users.methods';

export const UserSchema = new Schema({
    email: {
        type: String,
        minlength: 5,
        maxlength: [50, 'Email is too longer (maximal 50 characters) !!'],
        unique: true,
        lowercase: true,
        required: [true, 'Email should not blank'],
        validate: {
            validator: function (email: string) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
            },
            message: (props: ValidatorProps) => `${props.value} is not valid email !!!`,
        },
    },
    password: {
        type: String,
        minlength: [8, 'Password is too short (minimal 8 characters) !!'],
        required: [true, 'Password should not blank'],
    },
    firstName: {
        type: String,
        minlength: [2, 'Firstname is too short (minimal 2 characters) !!'],
        maxlength: [50, 'Firstname is too long (maximal 50 characters) !!'],
        required: [true, 'firstName should not blank'],
    },
    lastName: {
        type: String,
        minlength: [2, 'Lastname is too short (minimal 2 characters) !!'],
        maxlength: [50, 'Lastname is too long (maximal 50 characters) !!'],
        required: [true, 'lastName should not blank'],
    },
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
