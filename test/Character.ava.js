import React from 'react';

import test from 'ava';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import yaml from 'js-yaml';
import fs from 'fs';
import util from 'util';

import Character from '../src/Character';
import * as themes from '../src/themes';
import Photo from '../src/photo';

const readFilePromisified = util.promisify(fs.readFile);

const context = {
  muiTheme: themes.themeLight,
  setTitle: () => {},
  router: {
    history: {
      replace: () => {},
    },
  },
};

/** @test {Character} */
test('<Character /> should be loaded', t => {
  const wrapper = shallow(<Character match={{ params: { chara: 'kt-kitty' } }} />, { context, disableLifecycleMethods: true });
  const instance = wrapper.instance();
  t.not(instance, null);
});

/** @test {Character} */
test.cb('<Character /> should be loaded with kt-kitty', t => {
  let photoCount = -1;
  const loadPhotosDouble = sinon.stub(Photo, 'loadPhotos');
  loadPhotosDouble.callsFake(async arg => {
    const data = await readFilePromisified(`data/${arg}.yaml`, { encoding: 'utf-8' });
    const arr = yaml.safeLoad(data);
    photoCount = arr.length;
    return arr.map(obj => new Photo(obj));
  });
  try {
    const wrapper = mount(<Character match={{ params: { chara: 'kt-kitty' } }} />, { context });
    t.not(null, wrapper.state('message'));
    t.is(0, wrapper.state('message').indexOf('Loading'));
    t.is(null, wrapper.state('photos'));
    setTimeout(() => { // setImmediate does not work?
      t.is(null, wrapper.state('message'));
      t.not(null, wrapper.state('photos'));
      t.is(photoCount, wrapper.state('photos').length);
      t.end();
    }, 100);
  } finally {
    loadPhotosDouble.restore();
  }
});
