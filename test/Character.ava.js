import React from 'react';

import test from 'ava';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import yaml from 'js-yaml';
import fs from 'fs';
import util from 'util';

import Character from '../src/Character';
import Photo from '../src/photo';

const readFilePromisified = util.promisify(fs.readFile);

const context = {
  setTitle: () => {},
};

/** @test {Character} */
test('<Character /> should be loaded', t => {
  const wrapper = shallow(<Character match={{ params: { chara: 'kt-kitty' } }} />, { context, disableLifecycleMethods: true });
  const instance = wrapper.instance();
  t.not(instance, null);
});

/** @test {Character} */
test.cb('<Character /> should be loaded with ar-retsuko', t => {
  let photoCount = -1;
  const loadPhotosDouble = sinon.stub(Photo, 'loadPhotos');
  loadPhotosDouble.callsFake(async arg => {
    const data = await readFilePromisified(`data/${arg}.yaml`, { encoding: 'utf-8' });
    const arr = yaml.safeLoad(data);
    photoCount = arr.length;
    return arr.map(obj => new Photo(obj));
  });
  function checkLoaded(wrapper, interval, retry) {
    if (wrapper.state('allPhotos')) {
      t.is(photoCount, wrapper.state('photos').length);
      t.end();
    } else if (retry > 0) {
      setTimeout(() => checkLoaded(wrapper, interval, retry - 1), interval);
    } else {
      t.fail('did not load photos');
    }
  }
  try {
    const wrapper = shallow(<Character match={{ params: { chara: 'ar-retsuko' } }} />, { context });
    t.is(null, wrapper.state('allPhotos'));
    t.deepEqual([], wrapper.state('photos'));
    checkLoaded(wrapper, 100, 10);
  } finally {
    loadPhotosDouble.restore();
  }
});
