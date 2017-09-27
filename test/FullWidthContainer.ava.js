import React from 'react';

import test from 'ava';
import { mount } from 'enzyme';

import FullWidthContainer from '../src/FullWidthContainer';

/** @test {FullWidthContainer} */
test('<FullWidthContainer /> should call render with width', t => {
  let width = 0;
  const callback = w => {
    width = w;
    return React.createElement('div', { className: 'test' }, 'text');
  };
  const wrapper = mount(<FullWidthContainer renderElement={callback} />);
  t.is(wrapper.find('div.test').length, 1);
  t.is(wrapper.find('div.test').get(0).props.children, 'text');
  t.true(width > 0);
});
