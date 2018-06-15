import React from 'react';

import test from 'ava';
import Button from '@material-ui/core/Button';

import createShallow from '@material-ui/core/test-utils/createShallow';

import ColorSelector from '../src/ColorSelector';
import Colors from '../src/colors';

const shallow = createShallow({ dive: true });

const context = {};

function clickFilter(wrapper) {
  wrapper.find(Button).first().simulate('click');
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

/** @test {ColorSelector} */
test('<ColorSelector /> should not have any active items at first', t => {
  const wrapper = shallow(<ColorSelector />, { context });
  /** @type {ColorSelector} */
  const instance = wrapper.instance();
  t.deepEqual(instance.listActiveIds(), []);
  t.false(instance.isFilterEnabled());
});

/** @test {ColorSelector} */
test('<ColorSelector /> should toggle color buttons', t => {
  const wrapper = shallow(<ColorSelector />, { context });
  t.is(wrapper.find(Button).length, 1);
  clickFilter(wrapper);
  t.is(wrapper.find(Button).length, 1 + Colors.all.length + 1);
  clickFilter(wrapper);
  t.is(wrapper.find(Button).length, 1);
});

/** @test {ColorSelector} */
test('<ColorSelector /> should handle color button clicks', t => {
  const wrapper = shallow(<ColorSelector />, { context });
  /** @type {ColorSelector} */
  const instance = wrapper.instance();
  clickFilter(wrapper);
  clickColor(wrapper, 'red');
  t.deepEqual(instance.listActiveIds(), ['red']);
  clickColor(wrapper, 'blue');
  t.deepEqual(instance.listActiveIds(), ['red', 'blue']);
  clickColor(wrapper, 'red');
  t.deepEqual(instance.listActiveIds(), ['blue']);
  clickColor(wrapper, 'blue');
  t.deepEqual(instance.listActiveIds(), []);
});

/** @test {ColorSelector} */
test('<ColorSelector /> should remember active state after re-enabled', t => {
  const wrapper = shallow(<ColorSelector />, { context });
  /** @type {ColorSelector} */
  const instance = wrapper.instance();
  clickFilter(wrapper);
  clickColor(wrapper, 'red');
  clickColor(wrapper, 'blue');
  t.deepEqual(instance.listActiveIds(), ['red', 'blue']);
  clickFilter(wrapper);
  t.deepEqual(instance.listActiveIds(), []);
  clickFilter(wrapper);
  t.deepEqual(instance.listActiveIds(), ['red', 'blue']);
});

/** @test {ColorSelector} */
test('<ColorSelector /> should clear all actives', t => {
  const wrapper = shallow(<ColorSelector />, { context });
  /** @type {ColorSelector} */
  const instance = wrapper.instance();
  clickFilter(wrapper);
  clickColor(wrapper, 'red');
  clickColor(wrapper, 'blue');
  t.deepEqual(instance.listActiveIds(), ['red', 'blue']);
  clickClear(wrapper);
  t.deepEqual(instance.listActiveIds(), []);
});
