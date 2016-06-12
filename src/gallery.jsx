import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import Photo from './photo.js';

import LazyLoad from 'react-lazy-load';
import JustifiedLayout from 'react-justified-layout';
import Slider from 'material-ui/Slider';

export default class Gallery extends React.Component {
  constructor() {
    super();
    this.state = { thumbnailHeight: 72 };
    this.handleResize = this.updateContainerWidth.bind(this);

    this.thumbnailSizeChanged = this.thumbnailSizeChanged.bind(this);
  }
  componentDidMount() {
    this.updateContainerWidth();
    this.resizeSensor = new ResizeSensor(this.refs.gallery, this.handleResize);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.containerWidth !== prevState.containerWidth) {
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
  updateContainerWidth() {
    const newWidth = ReactDOM.findDOMNode(this).clientWidth;
    if (newWidth !== this.state.containerWidth) {
      this.setState({ containerWidth: newWidth });
    }
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
