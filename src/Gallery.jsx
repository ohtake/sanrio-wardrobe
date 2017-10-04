import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';

import LazyLoad from 'react-lazy-load';

import FullWidthContainer from './FullWidthContainer';
import JustifiedLayout from './JustifiedLayout';
import Photo from './photo';

const styleTitleOuter = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  color: 'white',
};
const styleTitleInner = {
  margin: '0.2em',
  height: '1.2em',
  overflow: 'hidden',
  wordBreak: 'break-all',
};

export default class Gallery extends React.Component {
  constructor() {
    super();
    this.photoToElement = this.photoToElement.bind(this);
  }
  /**
   * @param {Photo} p
   * @returns {React.Element}
   */
  photoToElement(p) {
    const theme = this.context.muiTheme;
    const thumbnailHeight = this.context.thumbnailSize;
    return (<div key={p.data.title} style={{ backgroundColor: theme.palette.borderColor }}>
      <Link to={`/chara/${this.props.chara}/${window.encodeURIComponent(p.data.title)}`} data-ga-on="click" data-ga-event-category="lightbox" data-ga-event-action="open" data-ga-event-label={`${this.props.chara} ${p.data.title}`}>
        <div style={styleTitleOuter}>
          <div style={styleTitleInner} title={p.data.title}>{p.data.title}</div>
        </div>
        <LazyLoad offset={thumbnailHeight}>
          <img alt={p.data.title} src={p.getLargestImageAtMost(320, 320).url} style={{ width: '100%', height: '100%' }} />
        </LazyLoad>
      </Link>
    </div>);
  }

  render() {
    if (this.props.photos) {
      const thumbnailHeight = this.context.thumbnailSize;
      return (<FullWidthContainer
        renderElement={width => (
          <JustifiedLayout targetRowHeight={thumbnailHeight} containerWidth={width} childObjects={this.props.photos} mapperToElement={this.photoToElement} mapperToAspectRatio={p => p.getAspectRatio()} />
        )}
      />);
    }
    return null;
  }
}
Gallery.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.instanceOf(Photo)),
  chara: PropTypes.string.isRequired,
};
Gallery.defaultProps = {
  photos: null,
};
Gallery.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
  thumbnailSize: PropTypes.number,
};
