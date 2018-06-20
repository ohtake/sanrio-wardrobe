import React from 'react';

import test from 'ava';
import clone from 'lodash/clone';
import range from 'lodash/range';
import createShallow from '@material-ui/core/test-utils/createShallow';

import Gallery from '../src/Gallery';
import Photo from '../src/photo';

const shallow = createShallow({ dive: true });

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

const context = {};

/** @test {Gallery} */
test('<Gallery /> should handle 0 photos', t => {
  const wrapper = shallow(<Gallery chara="zz-zzzzz" photos={[]} />, { context });
  const instance = wrapper.instance();
  t.not(instance, null);
});

/** @test {Gallery} */
test('<Gallery /> should handle 3 photos', t => {
  const photos = range(3).map(i => {
    const photo = clone(photoTemplate);
    photo.title = `template${i}`;
    return new Photo(photo);
  });
  const wrapper = shallow(<Gallery chara="zz-zzzzz" photos={photos} />, { context });
  const instance = wrapper.instance();
  t.not(instance, null);
});

/** @test {Gallery.photoToElement} */
test('Gallery.photoToElement should return an element', t => {
  const wrapper = shallow(<Gallery chara="zz-zzzzz" photos={[]} />, { context });
  const instance = wrapper.instance();
  const element = instance.photoToElement(new Photo(photoTemplate));
  t.not(element, null);
});
