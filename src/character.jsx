import React from 'react';

import Photo from './photo.js';
import CharacterSelector from './character_selector.jsx';
import ColorSelector from './color_selector.jsx';
import Gallery from './gallery.jsx';
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
      this.loadPhotos(this.refs.chara.selected());
    }, 100);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.chara !== this.props.chara) {
      this.loadPhotos(nextProps.params.chara);
      this.refs.color.clear();
    }
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
      } else {
        this.setState({
          photos: null,
          message: result.toString(),
        });
      }
    });
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
        <CharacterSelector />
        <ColorSelector ref="color" onChanged={this.colorChanged} />
        {this.state.message ? <div>{this.state.message}</div> : null}
        <Gallery ref="gallery" photos={this.state.photos} />
      </div>
    );
  }
}
Character.propTypes = utils.propTypesRoute;
