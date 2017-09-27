import React from 'react';

import test from 'ava';
import { shallow } from 'enzyme';

import JustifiedLayout from '../src/JustifiedLayout';

function str2span(str) {
  return React.createElement('span', {}, str);
}

/** @test {JustifiedLayout} */
test('<JustifiedLayout /> should handle 0 elements', t => {
  const wrapper = shallow(<JustifiedLayout childObjects={[]} mapperToElement={str2span} />);
  t.is(wrapper.find('span').length, 0);
});

/** @test {JustifiedLayout} */
test('<JustifiedLayout /> should handle 1 element', t => {
  const wrapper = shallow(<JustifiedLayout childObjects={['0']} mapperToElement={str2span} />);
  t.is(wrapper.find('span').length, 1);
  t.is(wrapper.find('span').get(0).props.children, '0');
});

/** @test {JustifiedLayout} */
test('<JustifiedLayout /> should handle 3 elements', t => {
  const wrapper = shallow(<JustifiedLayout childObjects={['0', '1', '2']} mapperToElement={str2span} />);
  t.is(wrapper.find('span').length, 3);
  t.is(wrapper.find('span').get(0).props.children, '0');
  t.is(wrapper.find('span').get(1).props.children, '1');
  t.is(wrapper.find('span').get(2).props.children, '2');
});
