import React from 'react';

import test from 'ava';
import createShallow from '@material-ui/core/test-utils/createShallow';

import App from '../src/App';

const shallow = createShallow({ dive: true });

/** @test {App} */
test('<App /> should be loaded', t => {
  const wrapper = shallow(<App params={{}} />);
  const instance = wrapper.instance();
  t.not(instance, null);
});
