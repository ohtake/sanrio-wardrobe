import React from 'react';
import { Link } from 'react-router';

import LazyLoad from 'react-lazy-load';
import JustifiedLayout from 'react-justified-layout';

import Photo from './photo.js';
import * as utils from './utils.js';

export default class Gallery extends React.Component {
  constructor() {
    super();
    this.state = { thumbnailHeight: 72 };
    this.widthListener = new utils.ContainerClientWidthListener(this, 'gallery', 'containerWidth');
  }
  componentDidMount() {
    this.widthListener.componentDidMount();
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.thumbnailSize) {
      this.setState({ thumbnailHeight: nextContext.thumbnailSize });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    this.widthListener.componentDidUpdate(prevProps, prevState);
  }
  componentWillUnmount() {
    this.widthListener.componentWillUnmount();
  }

  renderGallery() {
    const theme = this.context.muiTheme;
    let imgStyle = { width: '100%', height: '100%' };
    let imgs = this.props.photos.map((p) => (
      <div key={p.data.title} aspectRatio={p.getAspectRatio()} style={{ backgroundColor: theme.palette.borderColor }}>
        <Link to={`/chara/${this.props.chara}/${window.encodeURIComponent(p.data.title)}`} data-event-category="lightbox" data-event-action="open" data-event-label={`${this.props.chara} ${p.data.title}`}>
          <LazyLoad offset={this.state.thumbnailHeight}>
            <img alt={p.data.title} src={p.getLargestImageAtMost(500, 500).url} style={imgStyle} />
          </LazyLoad>
        </Link>
      </div>
    ));
    return <JustifiedLayout targetRowHeight={this.state.thumbnailHeight} containerPadding={0} boxSpacing={6} containerWidth={this.state.containerWidth}>{imgs}</JustifiedLayout>;
  }
  render() {
    return (
      <div ref="gallery">
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
