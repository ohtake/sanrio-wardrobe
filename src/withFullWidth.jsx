import React from 'react';
import PropTypes from 'prop-types';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

/**
 * It monitors client width and passes the width to child component.
 * @param {React.Component} Component A component which accepts width prop.
 * @param {string} propNameForWidth Prop name for width
 * @returns {React.Component}
 */
export default function withFullWidth(Component, propNameForWidth = 'width') {
  class FullWidthComponent extends React.Component {
    constructor() {
      super();
      this.refContainer = React.createRef();
      this.state = { containerWidth: 1080 };
      this.handleResize = this.updateContainerWidth.bind(this);
    }

    componentDidMount() {
      this.updateContainerWidth();
      this.resizeSensor = new ResizeSensor(this.refContainer.current, this.handleResize);
    }

    componentDidUpdate(prevProps, prevState) {
      const { containerWidth } = this.state;
      if (containerWidth !== prevState.containerWidth) {
        // Visibility change of scrollbar may trigger this event.
        // If this handler changes container width, it may change scrollbar visibility.
        // There is a condition of infinite flippings of scrollbar visibility.
        return;
      }
      this.updateContainerWidth();
    }

    componentWillUnmount() {
      this.resizeSensor.detach();
    }

    /**
     * @private
     * @returns {void}
     */
    updateContainerWidth() {
      const { containerWidth } = this.state;
      const newWidth = this.refContainer.current.clientWidth;
      if (newWidth && newWidth !== containerWidth) {
        this.setState({ containerWidth: newWidth });
      }
    }

    render() {
      const { containerWidth } = this.state;
      const widthProp = {
        [propNameForWidth]: containerWidth,
      };
      const { forwardedRef, ...rest } = this.props;
      return <div ref={this.refContainer}><Component ref={forwardedRef} {...rest} {...widthProp} /></div>;
    }
  }
  FullWidthComponent.propTypes = {
    forwardedRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  };
  FullWidthComponent.defaultProps = {
    forwardedRef: null,
  };
  FullWidthComponent.displayName = `withFullWidth(${Component.displayName || Component.name || 'Component'})`;
  // eslint-disable-next-line react/no-multi-comp
  return React.forwardRef((props, ref) => <FullWidthComponent {...props} forwardedRef={ref} />);
}
