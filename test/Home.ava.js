import React from 'react';

import test from 'ava';
import createShallow from '@material-ui/core/test-utils/createShallow';

import Home from '../src/Home';

const shallow = createShallow({ dive: true });

const context = {
  setTitle: () => {},
};

/** @test {Home} */
test('<Home /> should be loaded', t => {
  const wrapper = shallow(<Home />, { context });
  const instance = wrapper.instance();
  t.not(instance, null);
});
