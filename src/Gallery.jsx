import React from 'react';
import PropTypes from 'prop-types';
import RouterLink from 'react-router-dom/Link';

import LazyLoad from 'react-lazy-load';

import { withTheme } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import JustifiedLayoutFull from './JustifiedLayoutFull';
import Photo from './photo';
import Colors from './colors';

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

class Gallery extends React.Component {
  constructor() {
    super();
    this.photoToElement = this.photoToElement.bind(this);
  }

  /**
   * @param {Photo} p
   * @returns {React.Element}
   */
  photoToElement(p) {
    const { theme, chara } = this.props;
    const { thumbnailSize } = this.context;
    const placeholderBackground = (p.data.colors.length > 0) ? fade(Colors.findById(p.data.colors[0]).value, 0.4) : theme.palette.background.paper;
    return (
      <div key={p.data.title} style={{ backgroundColor: placeholderBackground }}>
        <RouterLink to={`/chara/${chara}/${window.encodeURIComponent(p.data.title)}`} data-ga-on="click" data-ga-event-category="lightbox" data-ga-event-action="open" data-ga-event-label={`${chara} ${p.data.title}`}>
          <div style={styleTitleOuter}>
            <div style={styleTitleInner} title={p.data.title}>{p.data.title}</div>
          </div>
          <LazyLoad offset={thumbnailSize}>
            <img alt={p.data.title} src={p.getLargestImageAtMost(320, 320).url} style={{ width: '100%', height: '100%' }} />
          </LazyLoad>
        </RouterLink>
      </div>);
  }

  render() {
    const { thumbnailSize } = this.context;
    const { photos } = this.props;
    return <JustifiedLayoutFull targetRowHeight={thumbnailSize} childObjects={photos} mapperToElement={this.photoToElement} mapperToAspectRatio={p => p.getAspectRatio()} />;
  }
}
Gallery.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  theme: PropTypes.object.isRequired,
  photos: PropTypes.arrayOf(PropTypes.instanceOf(Photo)),
  chara: PropTypes.string.isRequired,
};
Gallery.defaultProps = {
  photos: [],
};
Gallery.contextTypes = {
  thumbnailSize: PropTypes.number,
};

export default withTheme()(Gallery);
