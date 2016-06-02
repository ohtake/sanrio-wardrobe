import React from 'react';
import ReactDOM from 'react-dom';

/* eslint-disable no-console */
if (window.React === undefined) {
  console.warn('No React instance in global var. It won\'t work in production mode since React is in externals.');
} else if (React !== window.React) {
  console.info('Two React instances are loaded. No problem in development mode, as instance in global var will not be used.)');
  console.debug(`React version used: ${React.version}`);
  console.debug(`React version in global var: ${window.React.version}`);
  if (React.version !== window.React.version) {
    console.warn('React versions mismatch. Check package.json and index.html.');
  }
} else {
  // Only one React instance is loaded in global var. It might be in production mode.
}
/* eslint-enable */

import Photo from './photo.js';
import CharacterSelector from './character_selector.jsx';
import ColorSelector from './color_selector.jsx';
import Gallery from './gallery.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.state = { photos: null, message: 'Initializing' };

    this.characterChanged = this.characterChanged.bind(this);
    this.colorChanged = this.colorChanged.bind(this);
  }
  componentDidMount() {
    // Some browsers restore selected value after reload. Needs timeout.
    window.setTimeout(() => {
      this.refs.gallery.applyThumbnailSize();
      this.loadPhotos(this.refs.chara.selected());
    }, 100);
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
          if (p.data.colors.indexOf(c) < 0) return false;
        }
        return true;
      });
      this.setState({ photos });
    }
  }
  render() {
    return (
      <div className="App">
        <CharacterSelector ref="chara" onChanged={this.characterChanged} />
        <ColorSelector ref="color" onChanged={this.colorChanged} />
        {this.state.message ? <div>{this.state.message}</div> : null}
        <Gallery ref="gallery" photos={this.state.photos} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
