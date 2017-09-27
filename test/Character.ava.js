import React from 'react';

import test from 'ava';
import { shallow } from 'enzyme';

import Character from '../src/Character';
import * as themes from '../src/themes';

const context = {
  muiTheme: themes.themeLight,
  setTitle: () => {},
};

/** @test {Character} */
test('<Character /> should be loaded', t => {
  const wrapper = shallow(<Character match={{ params: { chara: 'kt-kitty' } }} />, { context, disableLifecycleMethods: true });
  const instance = wrapper.instance();
  t.not(instance, null);
});
