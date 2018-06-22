import React from 'react';
import PropTypes from 'prop-types';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

/**
 * It monitors client width and passes the width to child component.
 */
export default class FullWidthContainer extends React.Component {
  constructor(props) {
    super();
    this.refContainer = React.createRef();
    this.state = { containerWidth: props.initialContainerWidth };
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
    const { renderElement } = this.props;
    return (
      <div ref={this.refContainer}>
        {renderElement(containerWidth)}
      </div>);
  }
}
FullWidthContainer.propTypes = {
  renderElement: PropTypes.func.isRequired,
  initialContainerWidth: PropTypes.number,
};
FullWidthContainer.defaultProps = {
  initialContainerWidth: 1080,
};
