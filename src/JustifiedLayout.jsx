import React from 'react';
import PropTypes from 'prop-types';

import assign from 'lodash/assign';
import zip from 'lodash/zip';
import justifiedLayout from 'justified-layout';

/**
 * React component to layout elements by Flickr's justified-layout
 * @param {object} props
 * @returns {React.Element}
 */
export default function JustifiedLayout(props) {
  const {
    childObjects, mapperToAspectRatio, mapperToElement, containerWidth, targetRowHeight,
  } = props;
  const aspectRatios = childObjects.map(mapperToAspectRatio);
  const layoutConfig = {
    containerWidth,
    targetRowHeight,
    containerPadding: 0,
    boxSpacing: 6,
  };
  const layout = justifiedLayout(aspectRatios, layoutConfig);
  const childElems = zip(childObjects.map(mapperToElement), layout.boxes).map((e) => {
    const elem = e[0];
    const box = e[1];
    const style = assign({}, elem.props.style, box, { position: 'absolute', overflow: 'hidden' });
    const childProps = assign({}, elem.props, { style });
    return React.cloneElement(elem, childProps);
  });
  return (
    <div style={{ height: layout.containerHeight, width: containerWidth }}>
      {childElems}
    </div>);
}

JustifiedLayout.propTypes = {
  /**
   * An array of objects to be mapped to elements.
   */
  childObjects: PropTypes.arrayOf(PropTypes.any).isRequired,
  /**
   * It maps an object in the array to React element.
   * The returned React element should have key attribute.
   */
  mapperToElement: PropTypes.func.isRequired,
  /**
   * It maps an object in the array to aspect ratio of the React element.
   */
  mapperToAspectRatio: PropTypes.func,
  targetRowHeight: PropTypes.number,
  containerWidth: PropTypes.number,
};
JustifiedLayout.defaultProps = {
  mapperToAspectRatio: () => 1,
  targetRowHeight: 320,
  containerWidth: 1060,
};
