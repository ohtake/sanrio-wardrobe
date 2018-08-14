import React from 'react';
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
      return <div ref={this.refContainer}><Component {...this.props} {...widthProp} /></div>;
    }
  }
  FullWidthComponent.displayName = `withFullWidth(${Component.displayName || Component.name || 'Component'})`;
  return FullWidthComponent;
}
