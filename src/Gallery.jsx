import React from 'react';
import Link from 'react-router-dom/Link';

import LazyLoad from 'react-lazy-load';

import FullWidthContainer from './FullWidthContainer';
import JustifiedLayout from './JustifiedLayout';
import Photo from './photo';

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
  photos: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Photo)),
  chara: React.PropTypes.string.isRequired,
};
Gallery.defaultProps = {
  photos: null,
};
Gallery.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
  thumbnailSize: React.PropTypes.number,
};
