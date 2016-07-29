import './dom.js';

import React from 'react';
import { describe, it } from 'mocha';
import { default as chai, expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import { shallow } from 'enzyme';

import DetailView from '../src/DetailView.jsx';
import Photo from '../src/photo.js';
import * as themes from '../src/themes.js';
import clone from 'lodash/clone';

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

/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback, func-names */

describe('<DetailView />', function () {
  it('should be loaded without photos', function () {
    const wrapper = shallow(<DetailView chara="zz-zzzzz" />, { context });
    const instance = wrapper.instance();
    expect(instance).to.not.be.null;
  });
  it('should handle one photo', function () {
    const context2 = createContextWithSpiedRouter();
    const wrapper = shallow(<DetailView chara="zz-zzzzz" />, { context: context2 });
    const instance = wrapper.instance();
    wrapper.setState({ photos: [new Photo(photoTemplate)], index: 0 });
    instance.moveNext(dummyEvent);
    expect(context2.router.replace).to.have.callCount(1);
    expect(context2.router.replace).to.have.been.calledWith('/chara/zz-zzzzz/template');
    instance.movePrev(dummyEvent);
    expect(context2.router.replace).to.have.callCount(2);
    expect(context2.router.replace).to.have.been.calledWith('/chara/zz-zzzzz/template');
  });
  it('should handle four photo', function () {
    const context2 = createContextWithSpiedRouter();
    const wrapper = shallow(<DetailView chara="zz-zzzzz" />, { context: context2 });
    const instance = wrapper.instance();
    const photos = [];
    for (let i = 0; i < 4; i++) {
      const photo = clone(photoTemplate);
      photo.title = `template${i}`;
      photos.push(new Photo(photo));
    }
    wrapper.setState({ photos, index: 0 });
    instance.moveNext(dummyEvent);
    expect(context2.router.replace).to.have.callCount(1);
    expect(context2.router.replace).to.have.been.calledWith('/chara/zz-zzzzz/template1');
    wrapper.setState({ index: 1 }); // setState by Character component
    instance.movePrev(dummyEvent);
    expect(context2.router.replace).to.have.callCount(2);
    expect(context2.router.replace).to.have.been.calledWith('/chara/zz-zzzzz/template0');
    wrapper.setState({ index: 0 });
    instance.movePrev(dummyEvent);
    expect(context2.router.replace).to.have.callCount(3);
    expect(context2.router.replace).to.have.been.calledWith('/chara/zz-zzzzz/template3');
    wrapper.setState({ index: 3 });
    instance.moveNext(dummyEvent);
    expect(context2.router.replace).to.have.callCount(4);
    expect(context2.router.replace).to.have.been.calledWith('/chara/zz-zzzzz/template0');
  });
});
