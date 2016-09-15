import React from 'react';
import Link from 'react-router/lib/Link';

import LazyLoad from 'react-lazy-load';
import JustifiedLayout from 'react-justified-layout';
import Photo from './photo.js';
import * as utils from './utils.js';

export default class Gallery extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.widthListener = new utils.ContainerClientWidthListener(this, () => this.gallery, 'containerWidth');
  }
  componentDidMount() {
    this.widthListener.componentDidMount();
  }
  componentDidUpdate(prevProps, prevState) {
    this.widthListener.componentDidUpdate(prevProps, prevState);
  }
  componentWillUnmount() {
    this.widthListener.componentWillUnmount();
  }

  renderGallery() {
    const theme = this.context.muiTheme;
    const thumbnailHeight = this.context.thumbnailSize;
    const imgStyle = { width: '100%', height: '100%' };
    const imgs = this.props.photos.map(p => (
      <div key={p.data.title} aspectRatio={p.getAspectRatio()} style={{ backgroundColor: theme.palette.borderColor }}>
        <Link to={`/chara/${this.props.chara}/${window.encodeURIComponent(p.data.title)}`} data-ga-on="click" data-ga-event-category="lightbox" data-ga-event-action="open" data-ga-event-label={`${this.props.chara} ${p.data.title}`}>
          <LazyLoad offset={thumbnailHeight}>
            <img alt={p.data.title} src={p.getLargestImageAtMost(320, 320).url} style={imgStyle} />
          </LazyLoad>
        </Link>
      </div>
    ));
    return <JustifiedLayout targetRowHeight={thumbnailHeight} containerPadding={0} boxSpacing={6} containerWidth={this.state.containerWidth}>{imgs}</JustifiedLayout>;
  }
  render() {
    return (
      <div ref={(c) => { this.gallery = c; }}>
        {this.props.photos ? this.renderGallery() : null}
      </div>
    );
  }
}
Gallery.propTypes = {
  photos: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Photo)),
  chara: React.PropTypes.string.isRequired,
};
Gallery.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
  thumbnailSize: React.PropTypes.number,
};
