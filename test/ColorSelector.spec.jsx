import React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ColorSelector from '../src/ColorSelector.jsx';
import * as themes from '../src/themes.js';

const context = { muiTheme: themes.themeLight };

function clickFilter(wrapper) {
  wrapper.find({ label: 'Color filter' }).simulate('click');
}
function clickColor(wrapper, colorId) {
  wrapper.find({ data: colorId }).simulate('click', {
    preventDefault: () => {},
    currentTarget: { getAttribute: () => colorId },
  });
}
function clickClear(wrapper) {
  wrapper.find({ data: '' }).simulate('click');
}

/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback, func-names */

describe('<ColorSelector />', function () {
  it('should not have any active items at first', function () {
    const wrapper = shallow(<ColorSelector />, { context });
    const instance = wrapper.instance();
    expect(instance.listActiveIds()).to.eql([]);
    expect(instance.isFilterEnabled()).to.be.false;
  });
  it('should toggle color buttons', function () {
    const wrapper = shallow(<ColorSelector />, { context });
    expect(wrapper.find({ label: 'Red' }).length).to.equal(0);
    clickFilter(wrapper);
    expect(wrapper.find({ label: 'Red' }).length).to.equal(1);
    clickFilter(wrapper);
    expect(wrapper.find({ label: 'Red' }).length).to.equal(0);
  });
  it('should handle color button clicks', function () {
    const wrapper = shallow(<ColorSelector />, { context });
    const instance = wrapper.instance();
    clickFilter(wrapper);
    clickColor(wrapper, 'red');
    expect(instance.listActiveIds()).to.eql(['red']);
    clickColor(wrapper, 'blue');
    expect(instance.listActiveIds()).to.eql(['red', 'blue']);
    clickColor(wrapper, 'red');
    expect(instance.listActiveIds()).to.eql(['blue']);
    clickColor(wrapper, 'blue');
    expect(instance.listActiveIds()).to.eql([]);
  });
  it('should remember active state after re-enabled', function () {
    const wrapper = shallow(<ColorSelector />, { context });
    const instance = wrapper.instance();
    clickFilter(wrapper);
    clickColor(wrapper, 'red');
    clickColor(wrapper, 'blue');
    expect(instance.listActiveIds()).to.eql(['red', 'blue']);
    clickFilter(wrapper);
    expect(instance.listActiveIds()).to.eql([]);
    clickFilter(wrapper);
    expect(instance.listActiveIds()).to.eql(['red', 'blue']);
  });
  it('should clear all actives', function () {
    const wrapper = shallow(<ColorSelector />, { context });
    const instance = wrapper.instance();
    clickFilter(wrapper);
    clickColor(wrapper, 'red');
    clickColor(wrapper, 'blue');
    expect(instance.listActiveIds()).to.eql(['red', 'blue']);
    clickClear(wrapper);
    expect(instance.listActiveIds()).to.eql([]);
  });
});
