import 'reflect-metadata';
import { use } from 'chai';
import { restore } from 'sinon';
import sinonChai from 'sinon-chai';
use(sinonChai);

afterEach(() => {
    restore();
});
