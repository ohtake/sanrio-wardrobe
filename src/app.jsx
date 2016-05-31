import React from 'react';
import ReactDOM from 'react-dom';
import LazyLoad from 'react-lazy-load';
import Lightbox from 'react-image-lightbox';
import JustifiedLayout from 'react-justified-layout';
import yaml from 'js-yaml';
import icons from './icons';

/* eslint-disable no-unused-vars */
// Polyfills are not used but required
import Promise from 'es6-promise'; // For older browsers http://caniuse.com/#feat=promises
import fetch from 'whatwg-fetch';
/* eslint-enable */

import Photo from './photo.js';
import CharacterSelector from './character_selector.jsx';
import ColorSelector from './color_selector.jsx';

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
    this.moveNext = this.moveNext.bind(this);
    this.movePrev = this.movePrev.bind(this);
    this.toggleDescription = this.toggleDescription.bind(this);
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
    window.fetch(`data/${file}.yaml`).then(res => {
      if (res.ok) {
        return res.text();
      }
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    })
    .then(text => {
      const data = yaml.load(text);
      const photos = data.map(obj => new Photo(obj));
      this.allPhotos = photos;
      this.setState({
        photos: photos.slice(0),
        message: null,
      });
    })
    .catch(ex => {
      this.setState({
        photos: null,
        message: ex.toString(),
      });
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
        for (const c of colors) {
          if (p.data.tags.indexOf(`color:${c}`) < 0) return false;
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
  moveNext() {
    this.setState({ index: (this.state.index + 1) % this.state.photos.length });
  }
  movePrev() {
    this.setState({ index: (this.state.index + this.state.photos.length - 1) % this.state.photos.length });
  }
  toggleDescription(e) {
    e.preventDefault();
    this.setState({ showDescription: ! this.state.showDescription });
  }
  createNotesElement(photo) {
    return (
      <div style={{ position: 'fixed', top: '50px', left: 0, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <ul style={{ whiteSpace: 'normal', lineHeight: '1em', fontSize: '80%' }}>
          {photo.data.notes.map(n => <li>{n}</li>)}
        </ul>
      </div>);
  }
  createCreditElement(photo) {
    const texts = [];
    if (photo.data.source.author) texts.push(`by ${photo.data.source.author}`);
    if (photo.data.source.license) texts.push(`under ${photo.data.source.license}`);
    return (
      <div style={{ position: 'fixed', bottom: 0, right: 0 }}>
        <a href={photo.data.source.url} target="_blank" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '0.4em', display: 'inline-block', lineHeight: '1em', fontSize: '80%', textDecoration: 'none' }}>
          {texts.join(' ') || 'no credit info'}
        </a>
      </div>
    );
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
  renderLightbox() {
    const index = this.state.index;
    const len = this.state.photos.length;
    const main = this.state.photos[index];
    const next = this.state.photos[(index + 1) % len];
    const prev = this.state.photos[(index + len - 1) % len];
    const description = (
      <div>
        <span>{main.data.title}</span>
        {this.state.showDescription ? this.createNotesElement(main) : null}
        {this.createCreditElement(main)}
      </div>
    );
    const buttonStyle = {
      verticalAlign: 'middle',
      width: '40px',
      height: '35px',
      cursor: 'pointer',
      border: 'none',
      opacity: 0.7,
      ':hover': {
        opacity: 1,
      },
      ':active': {
        outline: 'none',
      },
    };
    return (<Lightbox
      mainSrc={main.inferLargeImage()}
      nextSrc={next.inferLargeImage()}
      prevSrc={prev.inferLargeImage()}
      mainSrcThumbnail={main.data.image}
      nextSrcThumbnail={next.data.image}
      prevSrcThumbnail={prev.data.image}
      onCloseRequest={this.closeLightbox}
      onMovePrevRequest={this.movePrev}
      onMoveNextRequest={this.moveNext}
      toolbarButtons={[
        <button title="Toggle notes" onClick={this.toggleDescription} style={[buttonStyle, { background: `${icons.Info} no-repeat center` }]} type="button" />,
      ]}
      imageTitle={description}
    />);
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
        {this.state.isOpen ? this.renderLightbox() : null}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
