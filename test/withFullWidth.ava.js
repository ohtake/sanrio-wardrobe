import React from 'react';
import PropTypes from 'prop-types';

import test from 'ava';
import { mount } from 'enzyme';

import withFullWidth from '../src/withFullWidth';

/** @test {withFullWidth} */
test('withFullWidth should set default width prop and pass other props', t => {
  let widthReceived = 0;
  function Component(props) {
    const { width, text } = props;
    widthReceived = width;
    return (
      <span>
        {text}
      </span>);
  }
  Component.propTypes = {
    width: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  };
  const HOC = withFullWidth(Component);
  const wrapper = mount(<HOC text="hello" />);
  t.is(wrapper.find('div span').length, 1);
  t.is(wrapper.find('div span').at(0).text(), 'hello');
  t.true(widthReceived > 0);
});

/** @test {withFullWidth} */
test('withFullWidth should set custom width prop', t => {
  let widthReceived = 0;
  function Component(props) {
    const { width2 } = props;
    widthReceived = width2;
    return <br />;
  }
  Component.propTypes = {
    width2: PropTypes.number.isRequired,
  };
  const HOC = withFullWidth(Component, 'width2');
  mount(<HOC />);
  t.true(widthReceived > 0);
});
