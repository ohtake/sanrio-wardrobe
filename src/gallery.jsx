import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

import Photo from './photo.js';

import LazyLoad from 'react-lazy-load';
import JustifiedLayout from 'react-justified-layout';

export default class Gallery extends React.Component {
  constructor() {
    super();
    this.state = { thumbnailHeight: 72 };
    this.handleResize = this.updateContainerWidth.bind(this);

    this.thumbnailSizeChanged = this.thumbnailSizeChanged.bind(this);
  }
  componentDidMount() {
    this.updateContainerWidth();
    window.addEventListener('resize', this.handleResize);
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
    window.removeEventListener('resize', this.handleResize, false);
  }
  updateContainerWidth() {
    const newWidth = ReactDOM.findDOMNode(this).clientWidth;
    if (newWidth !== this.state.containerWidth) {
      this.setState({ containerWidth: newWidth });
    }
  }
  applyThumbnailSize() {
    this.setState({ thumbnailHeight: parseInt(this.refs.size.value, 10) });
  }
  thumbnailSizeChanged() {
    this.applyThumbnailSize();
  }

  renderGallery() {
    let imgStyle = { width: '100%', height: '100%' };
    let imgs = this.props.photos.map((p) => (
      <div key={p.data.title} aspectRatio={p.getAspectRatio()} style={{ backgroundColor: 'silver' }}>
        <Link to={`/chara/${this.props.chara}/${window.encodeURIComponent(p.data.title)}`}>
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
      <div>
        <div>
          Thumbnail size <input ref="size" type="range" defaultValue={this.state.thumbnailHeight} min="36" max="288" onChange={this.thumbnailSizeChanged} />
        </div>
        {this.props.photos ? this.renderGallery() : null}
      </div>
    );
  }
}
Gallery.propTypes = {
  photos: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Photo)),
  chara: React.PropTypes.string.isRequired,
};
