import './dom.js';

import React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Gallery from '../src/Gallery.jsx';
import Photo from '../src/photo.js';
import * as themes from '../src/themes.js';
import clone from 'lodash/clone';

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

/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback, func-names */

describe('<Gallery />', function () {
  it('should handle 0 photos', function () {
    const wrapper = shallow(<Gallery chara="zz-zzzzz" photos={[]} />, { context });
    expect(wrapper.find('img').length).to.equal(0);
  });
  it('should handle 1 photo', function () {
    const wrapper = shallow(<Gallery chara="zz-zzzzz" photos={[new Photo(photoTemplate)]} />, { context });
    expect(wrapper.find('img').length).to.equal(1);
  });
  it('should handle 3 photos', function () {
    const photos = [];
    for (let i = 0; i < 3; i++) {
      const photo = clone(photoTemplate);
      photo.title = `template${i}`;
      photos.push(new Photo(photo));
    }
    const wrapper = shallow(<Gallery chara="zz-zzzzz" photos={photos} />, { context });
    expect(wrapper.find('img').length).to.equal(3);
    expect(wrapper.find({ alt: 'template1' }).length).to.equal(1);
  });
});
