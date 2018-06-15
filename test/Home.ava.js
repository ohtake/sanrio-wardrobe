import React from 'react';

import test from 'ava';
import { shallow } from 'enzyme';

import Home from '../src/Home';

const context = {
  setTitle: () => {},
};

/** @test {Home} */
test('<Home /> should be loaded', t => {
  const wrapper = shallow(<Home />, { context });
  const instance = wrapper.instance();
  t.not(instance, null);
});
