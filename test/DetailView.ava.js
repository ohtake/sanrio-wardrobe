import React from 'react';

import test from 'ava';
import sinon from 'sinon';
import createShallow from '@material-ui/core/test-utils/createShallow';
import clone from 'lodash/clone';
import range from 'lodash/range';

import AppBar from '@material-ui/core/AppBar';

import DetailView from '../src/DetailView';
import Photo from '../src/photo';

const shallow = createShallow({ dive: true });

const dummyEvent = {
  preventDefault: () => {},
};
const dummyRouter = {
  history: {
    replace: () => {},
  },
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

const context = { router: dummyRouter };

function createContextWithSpiedRouter() {
  const c = {};
  c.router = clone(dummyRouter);
  c.router.history.replace = sinon.spy();
  return c;
}

/** @test {DetailView} */
test('<DetailView /> should be loaded without photos', t => {
  const wrapper = shallow(<DetailView chara="zz-zzzzz" />, { context });
  const instance = wrapper.instance();
  t.not(instance, null);
});

/** @test {DetailView} */
test('<DetailView /> should handle one photo', t => {
  const context2 = createContextWithSpiedRouter();
  const wrapper = shallow(<DetailView chara="zz-zzzzz" photos={[new Photo(photoTemplate)]} index={0} />, { context: context2 });
  const instance = wrapper.instance();
  instance.moveNext(dummyEvent);
  t.is(context2.router.history.replace.callCount, 1);
  t.deepEqual(context2.router.history.replace.lastCall.args, ['/chara/zz-zzzzz/template']);
  instance.movePrev(dummyEvent);
  t.is(context2.router.history.replace.callCount, 2);
  t.deepEqual(context2.router.history.replace.lastCall.args, ['/chara/zz-zzzzz/template']);
});

/** @test {DetailView} */
test('<DetailView /> should handle four photo', t => {
  const context2 = createContextWithSpiedRouter();
  const wrapper = shallow(<DetailView chara="zz-zzzzz" />, { context: context2 });
  const instance = wrapper.instance();
  const photos = range(4).map(i => {
    const photo = clone(photoTemplate);
    photo.title = `template${i}`;
    return new Photo(photo);
  });
  wrapper.setProps({ photos, index: 0 });
  instance.moveNext(dummyEvent);
  t.is(context2.router.history.replace.callCount, 1);
  t.deepEqual(context2.router.history.replace.lastCall.args, ['/chara/zz-zzzzz/template1']);
  wrapper.setProps({ index: 1 });
  instance.movePrev(dummyEvent);
  t.is(context2.router.history.replace.callCount, 2);
  t.deepEqual(context2.router.history.replace.lastCall.args, ['/chara/zz-zzzzz/template0']);
  wrapper.setProps({ index: 0 });
  instance.movePrev(dummyEvent);
  t.is(context2.router.history.replace.callCount, 3);
  t.deepEqual(context2.router.history.replace.lastCall.args, ['/chara/zz-zzzzz/template3']);
  wrapper.setProps({ index: 3 });
  instance.moveNext(dummyEvent);
  t.is(context2.router.history.replace.callCount, 4);
  t.deepEqual(context2.router.history.replace.lastCall.args, ['/chara/zz-zzzzz/template0']);
});

/** @test {DetailView#toggleInfo} */
test('<DetailView /> should handle toggleInfo', t => {
  const wrapper = shallow(<DetailView chara="zz-zzzzz" photos={[new Photo(photoTemplate)]} index={0} />, { context });
  const instance = wrapper.instance();
  t.true(wrapper.find(AppBar).exists());
  instance.toggleInfo();
  wrapper.update(); // Why required?
  t.false(wrapper.find(AppBar).exists());
});
