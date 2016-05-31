import React from 'react';
import ReactDOM from 'react-dom';
import LazyLoad from 'react-lazy-load';
import JustifiedLayout from 'react-justified-layout';

import Photo from './photo.js';
import CharacterSelector from './character_selector.jsx';
import ColorSelector from './color_selector.jsx';
import Lightbox from './lightbox.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.state = { photos: null, message: 'Initializing', thumbnailHeight: 72 };
    this.handleResize = this.updateContainerWidth.bind(this);

    this.thumbnailSizeChanged = this.thumbnailSizeChanged.bind(this);
    this.characterChanged = this.characterChanged.bind(this);
    this.colorChanged = this.colorChanged.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
  }
  componentDidMount() {
    this.updateContainerWidth();
    window.addEventListener('resize', this.handleResize);
    // Some browsers restore selected value after reload. Needs timeout.
    window.setTimeout(() => {
      this.setState({ thumbnailHeight: parseInt(this.refs.size.value, 10) });
      this.loadPhotos(this.refs.chara.selected());
    }, 100);
  }
  componentDidUpdate() {
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
  thumbnailSizeChanged(e) {
    this.setState({ thumbnailHeight: parseInt(e.target.value, 10) });
  }
  characterChanged(filename) {
    this.loadPhotos(filename);
    this.refs.color.clear();
  }
  colorChanged(sender) {
    const colors = sender.listActiveIds();
    if (colors.length === 0) {
      this.setState({ photos: this.allPhotos });
    } else {
      const photos = this.allPhotos.filter(p => {
        for (let i = 0; i < colors.length; i++) {
          if (p.data.tags.indexOf(`color:${colors[i]}`) < 0) return false;
        }
        return true;
      });
      this.setState({ photos });
    }
  }

  openLightbox(e) {
    e.preventDefault();
    const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
    this.setState({ isOpen: true, index });
  }
  closeLightbox() {
    this.setState({ isOpen: false });
  }

  renderGallery() {
    let imgStyle = { width: '100%', height: '100%' };
    let imgs = this.state.photos.map((p, i) => (
      <div aspectRatio={p.getAspectRatio()} style={{ backgroundColor: 'silver' }}>
        <a href="#" onClick={this.openLightbox} data-index={i}>
          <LazyLoad offset={this.state.thumbnailHeight}>
            <img alt={p.data.title} src={p.data.image} style={imgStyle} />
          </LazyLoad>
        </a>
      </div>
    ));
    return <JustifiedLayout targetRowHeight={this.state.thumbnailHeight} containerPadding={0} boxSpacing={6} containerWidth={this.state.containerWidth}>{imgs}</JustifiedLayout>;
  }
  render() {
    return (
      <div className="App">
        <div>
          Thumbnail size <input ref="size" type="range" defaultValue={this.state.thumbnailHeight} min="36" max="288" onChange={this.thumbnailSizeChanged} />
        </div>
        <CharacterSelector ref="chara" onChanged={this.characterChanged} />
        <ColorSelector ref="color" onChanged={this.colorChanged} />
        {this.state.message ? <div>{this.state.message}</div> : null}
        {this.state.photos ? this.renderGallery() : null}
        {this.state.isOpen ? <Lightbox index={this.state.index} photos={this.state.photos} closeLightbox={this.closeLightbox} /> : null}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
