import Mocha from 'mocha';

const mocha = new Mocha();
mocha.addFile('test/data_file.spec.js');
mocha.run();
