import React from 'react';

import test from 'ava';
import sinon from 'sinon';
import createShallow from '@material-ui/core/test-utils/createShallow';
import clone from 'lodash/clone';
import range from 'lodash/range';

import AppBar from '@material-ui/core/AppBar';

import DetailView from '../src/DetailView';
import Photo from '../src/photo';
import * as utils from '../src/utils';

const shallow = createShallow({ dive: true });

const dummyEvent = {
  preventDefault: () => {},
};

const photoTemplate = {
  title: 'template',
  images: [
    { url: 'https://placehold.it/600x400', height: 400 },
  ],
  source: { author: 'brent', license: '', url: 'https://placehold.it/' },
  size: { width_o: 1200, height_o: 800 },
  colors: ['red'],
  notes: ['note1', 'note2'],
};

/** @test {DetailView} */
test('<DetailView /> should be loaded without photos', t => {
  const wrapper = shallow(<DetailView chara="zz-zzzzz" />);
  const instance = wrapper.instance();
  t.not(instance, null);
});

/** @test {DetailView} */
test('<DetailView /> should handle one photo', t => {
  const wrapper = shallow(<DetailView chara="zz-zzzzz" photos={[new Photo(photoTemplate)]} index={0} />);
  const instance = wrapper.instance();
  const history = utils.getRouterHistory();
  history.replace = sinon.spy();
  instance.moveNext(dummyEvent);
  t.is(history.replace.callCount, 1);
  t.deepEqual(history.replace.lastCall.args, ['/chara/zz-zzzzz/template']);
  instance.movePrev(dummyEvent);
  t.is(history.replace.callCount, 2);
  t.deepEqual(history.replace.lastCall.args, ['/chara/zz-zzzzz/template']);
});

/** @test {DetailView} */
test('<DetailView /> should handle four photo', t => {
  const wrapper = shallow(<DetailView chara="zz-zzzzz" />);
  const instance = wrapper.instance();
  const photos = range(4).map(i => {
    const photo = clone(photoTemplate);
    photo.title = `template${i}`;
    return new Photo(photo);
  });
  const history = utils.getRouterHistory();
  history.replace = sinon.spy();
  wrapper.setProps({ photos, index: 0 });
  instance.moveNext(dummyEvent);
  t.is(history.replace.callCount, 1);
  t.deepEqual(history.replace.lastCall.args, ['/chara/zz-zzzzz/template1']);
  wrapper.setProps({ index: 1 });
  instance.movePrev(dummyEvent);
  t.is(history.replace.callCount, 2);
  t.deepEqual(history.replace.lastCall.args, ['/chara/zz-zzzzz/template0']);
  wrapper.setProps({ index: 0 });
  instance.movePrev(dummyEvent);
  t.is(history.replace.callCount, 3);
  t.deepEqual(history.replace.lastCall.args, ['/chara/zz-zzzzz/template3']);
  wrapper.setProps({ index: 3 });
  instance.moveNext(dummyEvent);
  t.is(history.replace.callCount, 4);
  t.deepEqual(history.replace.lastCall.args, ['/chara/zz-zzzzz/template0']);
});

/** @test {DetailView#toggleInfo} */
test('<DetailView /> should handle toggleInfo', t => {
  const wrapper = shallow(<DetailView chara="zz-zzzzz" photos={[new Photo(photoTemplate)]} index={0} />);
  const instance = wrapper.instance();
  t.true(wrapper.find(AppBar).exists());
  instance.toggleInfo();
  wrapper.update(); // Why required?
  t.false(wrapper.find(AppBar).exists());
});
