import React from 'react';
import { Link } from 'react-router';

import LazyLoad from 'react-lazy-load';
import JustifiedLayout from 'react-justified-layout';
import Slider from 'material-ui/Slider';

import Photo from './photo.js';
import * as utils from './utils.js';

export default class Gallery extends React.Component {
  constructor() {
    super();
    this.state = { thumbnailHeight: 72 };
    this.thumbnailSizeChanged = this.thumbnailSizeChanged.bind(this);
    this.widthListener = new utils.ContainerClientWidthListener(this, 'gallery', 'containerWidth');
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
  applyThumbnailSize() {
    this.setState({ thumbnailHeight: this.refs.size.state.value });
  }
  thumbnailSizeChanged() {
    this.applyThumbnailSize();
  }

  renderGallery() {
    const theme = this.context.muiTheme;
    let imgStyle = { width: '100%', height: '100%' };
    let imgs = this.props.photos.map((p) => (
      <div key={p.data.title} aspectRatio={p.getAspectRatio()} style={{ backgroundColor: theme.palette.borderColor }}>
        <Link to={`/chara/${this.props.chara}/${window.encodeURIComponent(p.data.title)}`} data-event-category="lightbox" data-event-action="open" data-event-label={`${this.props.chara} ${p.data.title}`}>
          <LazyLoad offset={this.state.thumbnailHeight}>
            <img alt={p.data.title} src={p.data.image} style={imgStyle} />
          </LazyLoad>
        </Link>
      </div>
    ));
    return <JustifiedLayout targetRowHeight={this.state.thumbnailHeight} containerPadding={0} boxSpacing={6} containerWidth={this.state.containerWidth}>{imgs}</JustifiedLayout>;
  }
  render() {
    return (
      <div ref="gallery">
        <Slider ref="size" defaultValue={this.state.thumbnailHeight} min={36} max={288} step={1} description={`Thumbnail size: ${this.state.thumbnailHeight}`} onChange={this.thumbnailSizeChanged} style={{ width: '18em' }} />
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
};
