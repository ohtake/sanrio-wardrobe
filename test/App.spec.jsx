import 'enzyme/withDom';

import React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import App from '../src/App.jsx';

describe('<App />', function () {
  it('should be loaded', function () {
    const wrapper = shallow(<App params={{}} />);
    const instance = wrapper.instance();
    expect(instance).to.not.be.null;
  });
});
