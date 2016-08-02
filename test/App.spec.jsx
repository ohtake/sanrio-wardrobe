/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import './dom.js';
import App from '../src/App.jsx';

/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback, func-names */

describe('<App />', function () {
  it('should be loaded', function () {
    const wrapper = shallow(<App params={{}} />);
    const instance = wrapper.instance();
    expect(instance).to.not.be.null;
  });
});
