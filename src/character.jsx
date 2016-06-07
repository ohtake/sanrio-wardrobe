import React from 'react';

import Photo from './photo.js';
import ColorSelector from './color_selector.jsx';
import Gallery from './gallery.jsx';
import Lightbox from './lightbox.jsx';
import * as utils from './utils.js';

export default class Character extends React.Component {
  constructor(props) {
    super();
    this.state = { filename: props.params.chara, message: 'Initializing' };

    this.colorChanged = this.colorChanged.bind(this);
  }
  componentDidMount() {
    this.loadPhotos(this.props.params.chara);

    // Some browsers restore selected value after reload. Needs timeout.
    window.setTimeout(() => {
      this.refs.gallery.applyThumbnailSize();
    }, 100);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.chara !== this.props.params.chara) {
      this.loadPhotos(nextProps.params.chara);
      this.refs.color.clear();
    }
    this.updateLightbox(nextProps);
  }
  loadPhotos(file) {
    this.setState({
      photos: null,
      message: `Loading ${file}`,
    });
    Photo.loadPhotos(file, (ok, result) => {
      if (ok) {
        this.allPhotos = result;
        this.setState({
          photos: result.slice(0),
          message: null,
        });
        this.updateLightbox(this.props);
      } else {
        this.setState({
          photos: null,
          message: result.toString(),
        });
      }
    });
  }
  updateLightbox(props) {
    const title = props.params.title;
    if (title) {
      const index = this.state.photos.findIndex(p => title === p.data.title);
      if (index >= 0) {
        this.refs.lightbox.setState({ photos: this.state.photos, index });
        return;
      }
      this.context.router.replace(`/chara/${this.props.params.chara}`);
    }
    this.refs.lightbox.setState({ photos: null, index: 0 });
  }
  colorChanged(sender) {
    const colors = sender.listActiveIds();
    if (colors.length === 0) {
      this.setState({ photos: this.allPhotos });
    } else {
      const photos = this.allPhotos.filter(p => {
        for (const c of colors) {
          if (p.data.colors.indexOf(c) < 0) return false;
        }
        return true;
      });
      this.setState({ photos });
    }
  }
  render() {
    return (
      <div>
        <ColorSelector ref="color" onChanged={this.colorChanged} />
        {this.state.message ? <div>{this.state.message}</div> : null}
        <Gallery ref="gallery" photos={this.state.photos} chara={this.props.params.chara} />
        <Lightbox ref="lightbox" chara={this.props.params.chara} />
      </div>
    );
  }
}
Character.propTypes = utils.propTypesRoute;
Character.contextTypes = {
  router: React.PropTypes.object,
};
