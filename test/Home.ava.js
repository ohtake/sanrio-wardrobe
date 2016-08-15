import 'enzyme/withDom';

import React from 'react';

import test from 'ava';
import { shallow } from 'enzyme';

import Home from '../src/Home.jsx';
import * as themes from '../src/themes.js';

const context = { muiTheme: themes.themeLight };

test('<Home /> should be loaded', t => {
  const wrapper = shallow(<Home />, { context });
  const instance = wrapper.instance();
  t.not(instance, null);
});
