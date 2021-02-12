import { expect } from 'chai';
import { REGISTER_KEY, VIDEO_KEY, PLAYLIST_KEY } from '../../constant/valid_keys';

describe('REGISTER_KEY', () => {
    const valid_register_key = ['email', 'password', 'firstName', 'lastName', 'birthDate'];
    const invalid_register_key = ['a', 'v', 'b', 'c', 'd', 'e'];

    it('Should describe valid user registration data key', () => {
        expect(REGISTER_KEY.length).to.be.equal(valid_register_key.length);
        expect(REGISTER_KEY.join(' ')).to.be.equal(valid_register_key.join(' '));
    });

    it('Should describe invalid user registration data key', () => {
        expect(REGISTER_KEY.join(' ')).to.be.not.equal(invalid_register_key.join(' '));
    });
});

describe('PLAYLIST_KEY', () => {
    const valid_video_key = ['title', 'description', 'slug'];
    const invalid_video_key = ['a', 'v', 'b', 'c', 'd', 'e'];

    it("Should describe valid user's video data key", () => {
        expect(VIDEO_KEY.length).to.be.equal(valid_video_key.length);
        expect(VIDEO_KEY.join(' ')).to.be.equal(valid_video_key.join(' '));
    });

    it("Should describe invalid user's video data key", () => {
        expect(VIDEO_KEY.join(' ')).to.be.not.equal(invalid_video_key.join(' '));
    });
});

describe('PLAYLIST_KEY', () => {
    const valid_playlist = ['name', 'description'];
    const invalid_playlist = ['a', 'v', 'b', 'c', 'd', 'e'];

    it("Should describe valid user's playlist data key", () => {
        expect(PLAYLIST_KEY.length).to.be.equal(valid_playlist.length);
        expect(PLAYLIST_KEY.join(' ')).to.be.equal(valid_playlist.join(' '));
    });

    it("Should describe invalid user's playlist data key", () => {
        expect(PLAYLIST_KEY.join(' ')).to.be.not.equal(invalid_playlist.join(' '));
    });
});
