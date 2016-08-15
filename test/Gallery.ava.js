import 'enzyme/withDom';

import React from 'react';

import test from 'ava';
import { shallow } from 'enzyme';
import clone from 'lodash/clone';

import Gallery from '../src/Gallery.jsx';
import Photo from '../src/photo.js';
import * as themes from '../src/themes.js';

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

const context = { muiTheme: themes.themeLight };

test('<Gallery /> should handle 0 photos', t => {
  const wrapper = shallow(<Gallery chara="zz-zzzzz" photos={[]} />, { context });
  t.is(wrapper.find('img').length, 0);
});

test('<Gallery /> should handle 1 photo', t => {
  const wrapper = shallow(<Gallery chara="zz-zzzzz" photos={[new Photo(photoTemplate)]} />, { context });
  t.is(wrapper.find('img').length, 1);
});

test('<Gallery /> should handle 3 photos', t => {
  const photos = [];
  for (let i = 0; i < 3; i++) {
    const photo = clone(photoTemplate);
    photo.title = `template${i}`;
    photos.push(new Photo(photo));
  }
  const wrapper = shallow(<Gallery chara="zz-zzzzz" photos={photos} />, { context });
  t.is(wrapper.find('img').length, 3);
  t.is(wrapper.find({ alt: 'template1' }).length, 1);
});
