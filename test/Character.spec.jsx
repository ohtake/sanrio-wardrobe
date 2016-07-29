import './dom.js';

import React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Character from '../src/Character.jsx';
import * as themes from '../src/themes.js';

const context = { muiTheme: themes.themeLight };

/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback, func-names */

describe('<Character />', function () {
  it('should be loaded', function () {
    const wrapper = shallow(<Character params={{ chara: 'kt-kitty' }} />, { context });
    const instance = wrapper.instance();
    expect(instance).to.not.be.null;
  });
});
