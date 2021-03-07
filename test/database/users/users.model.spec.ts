import { expect } from 'chai';
import { connect, disconnect } from '../../../src/database/database';
import { UserModel } from '../../../src/database/users/users.model';
import { IUser, IUserDocument } from '../../../src/database/users/users.types';

const validUser: IUser = {
    email: 'email1@email.com',
    password: 'password',
    firstName: 'ucok',
    lastName: 'lastName',
    birthDate: new Date('10-20-1990'),
    imageUrl: 'imageUrl',
    dateOfEntry: new Date(),
    lastUpdated: new Date(),
};

async function deleteData() {
    [validUser].forEach(async (user) => {
        await UserModel.deleteOne({ email: user.email });
    });
    console.log('🏁🏁🏁... Successfully deleted all user data test(s)');
}

before(async function () {
    connect();
    await deleteData();
    console.log('🚀🚀🚀... User model data test started !!...\n\n');
});

after(function () {
    deleteData();
    disconnect();
});

describe('User Model Testing', function () {
    it('Should create user with valid data', async () => {
        const user = <IUserDocument>await UserModel.create(validUser);
        expect(user.firstName).to.be.equal(validUser.firstName);
    });
    it('Should not create a user because invalid email', async () => {
        const user: IUser = Object.assign({}, validUser);
        user.email = 'invalid_email123';
        try {
            await UserModel.create(user);
        } catch (error) {
            expect(error.message).to.be.equal(`user validation failed: email: ${user.email} is not valid email !!!`);
        }
    });
    it('Should not create a user because too longer email', async () => {
        try {
            const user: IUser = Object.assign({}, validUser);
            user.email = 'LaEjiYVZbQqV0By7uDN1aAIHXvjYjPK2MXW851VGIwJtdZ2r9wasdada@mail.com';
            await UserModel.create(user);
        } catch (error) {
            expect(error.message).to.be.equal(
                'user validation failed: email: Email is too longer (maximal 50 characters) !!',
            );
        }
    });
    it('Should not create a user because too shorter password', async () => {
        try {
            const user: IUser = Object.assign({}, validUser);
            user.password = 'asdas';
            await UserModel.create(user);
        } catch (error) {
            expect(error.message).to.be.equal(
                'user validation failed: password: Password is too short (minimal 8 characters) !!',
            );
        }
    });
    it('Should not create a user because too shorter firstName', async () => {
        try {
            const user: IUser = Object.assign({}, validUser);
            user.firstName = 'a';
            await UserModel.create(user);
        } catch (error) {
            expect(error.message).to.be.equal(
                'user validation failed: firstName: Firstname is too short (minimal 2 characters) !!',
            );
        }
    });
    it('Should not create a user because too longer firstName', async () => {
        try {
            const user: IUser = Object.assign({}, validUser);
            user.firstName = 'LaEjiYVZbQqV0By7uDN1aAIHXvjYjPK2MXW851VGIwJtdZ2r9wasdada';
            await UserModel.create(user);
        } catch (error) {
            expect(error.message).to.be.equal(
                'user validation failed: firstName: Firstname is too long (maximal 50 characters) !!',
            );
        }
    });
    it('Should not create a user because too shorter lastName', async () => {
        try {
            const user: IUser = Object.assign({}, validUser);
            user.lastName = 'a';
            await UserModel.create(user);
        } catch (error) {
            expect(error.message).to.be.equal(
                'user validation failed: lastName: Lastname is too short (minimal 2 characters) !!',
            );
        }
    });
    it('Should not create a user because too longer lastName', async () => {
        try {
            const user: IUser = Object.assign({}, validUser);
            user.lastName = 'Lastname is too long (maximal 50 characters) !!asdas';
            await UserModel.create(user);
        } catch (error) {
            expect(error.message).to.be.equal(
                'user validation failed: lastName: Lastname is too long (maximal 50 characters) !!',
            );
        }
    });
});
