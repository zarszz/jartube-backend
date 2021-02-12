import { task } from 'gulp';
import del from 'del';

task('default', function () {
    return del(['build/']);
});
