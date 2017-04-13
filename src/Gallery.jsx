import React from 'react';
import Link from 'react-router-dom/Link';

import LazyLoad from 'react-lazy-load';

import JustifiedLayout from './JustifiedLayout';
import Photo from './photo';
import * as utils from './utils';

export default class Gallery extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.widthListener = new utils.ContainerClientWidthListener(this, () => this.gallery, 'containerWidth');
    this.photoToElement = this.photoToElement.bind(this);
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
    const thumbnailHeight = this.context.thumbnailSize;
    return (
      <div ref={(c) => { this.gallery = c; }}>
        {this.props.photos ?
          <JustifiedLayout targetRowHeight={thumbnailHeight} containerWidth={this.state.containerWidth} childObjects={this.props.photos} mapperToElement={this.photoToElement} mapperToAspectRatio={p => p.getAspectRatio()} />
          : null}
      </div>
    );
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
