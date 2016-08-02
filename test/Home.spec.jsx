/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import './dom.js';
import Home from '../src/Home.jsx';
import * as themes from '../src/themes.js';

const context = { muiTheme: themes.themeLight };

/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback, func-names */

describe('<Home />', function () {
  it('should be loaded', function () {
    const wrapper = shallow(<Home />, { context });
    const instance = wrapper.instance();
    expect(instance).to.not.be.null;
  });
});
