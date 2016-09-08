import 'enzyme/withDom';

import React from 'react';

import test from 'ava';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import clone from 'lodash/clone';
import range from 'lodash/range';

import DetailView from '../src/DetailView.jsx';
import Photo from '../src/photo.js';
import * as themes from '../src/themes.js';

const dummyEvent = {
  preventDefault: () => {},
};
const dummyRouter = {
  replace: () => {},
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

const context = { muiTheme: themes.themeLight, router: dummyRouter };

function createContextWithSpiedRouter() {
  const c = { muiTheme: themes.themeLight };
  c.router = clone(dummyRouter);
  c.router.replace = sinon.spy();
  return c;
}

test('<DetailView /> should be loaded without photos', t => {
  const wrapper = shallow(<DetailView chara="zz-zzzzz" />, { context });
  const instance = wrapper.instance();
  t.not(instance, null);
});

test('<DetailView /> should handle one photo', t => {
  const context2 = createContextWithSpiedRouter();
  const wrapper = shallow(<DetailView chara="zz-zzzzz" />, { context: context2 });
  const instance = wrapper.instance();
  wrapper.setState({ photos: [new Photo(photoTemplate)], index: 0 });
  instance.moveNext(dummyEvent);
  t.is(context2.router.replace.callCount, 1);
  t.deepEqual(context2.router.replace.lastCall.args, ['/chara/zz-zzzzz/template']);
  instance.movePrev(dummyEvent);
  t.is(context2.router.replace.callCount, 2);
  t.deepEqual(context2.router.replace.lastCall.args, ['/chara/zz-zzzzz/template']);
});

test('<DetailView /> should handle four photo', t => {
  const context2 = createContextWithSpiedRouter();
  const wrapper = shallow(<DetailView chara="zz-zzzzz" />, { context: context2 });
  const instance = wrapper.instance();
  const photos = range(4).map(i => {
    const photo = clone(photoTemplate);
    photo.title = `template${i}`;
    return new Photo(photo);
  });
  wrapper.setState({ photos, index: 0 });
  instance.moveNext(dummyEvent);
  t.is(context2.router.replace.callCount, 1);
  t.deepEqual(context2.router.replace.lastCall.args, ['/chara/zz-zzzzz/template1']);
  wrapper.setState({ index: 1 }); // setState by Character component
  instance.movePrev(dummyEvent);
  t.is(context2.router.replace.callCount, 2);
  t.deepEqual(context2.router.replace.lastCall.args, ['/chara/zz-zzzzz/template0']);
  wrapper.setState({ index: 0 });
  instance.movePrev(dummyEvent);
  t.is(context2.router.replace.callCount, 3);
  t.deepEqual(context2.router.replace.lastCall.args, ['/chara/zz-zzzzz/template3']);
  wrapper.setState({ index: 3 });
  instance.moveNext(dummyEvent);
  t.is(context2.router.replace.callCount, 4);
  t.deepEqual(context2.router.replace.lastCall.args, ['/chara/zz-zzzzz/template0']);
});
