import React from 'react';
import RLightbox from 'react-image-lightbox';
import icons from './icons';

import Photo from './photo.js';

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

export default class Lightbox2 extends React.Component {
  constructor(props) {
    super();

    this.state = { photos: props.photos, index: props.index };

    this.moveNext = this.moveNext.bind(this);
    this.movePrev = this.movePrev.bind(this);
    this.toggleDescription = this.toggleDescription.bind(this);
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
  render() {
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
    return (<RLightbox
      mainSrc={main.inferLargeImage()}
      nextSrc={next.inferLargeImage()}
      prevSrc={prev.inferLargeImage()}
      mainSrcThumbnail={main.data.image}
      nextSrcThumbnail={next.data.image}
      prevSrcThumbnail={prev.data.image}
      onCloseRequest={this.props.closeLightbox}
      onMovePrevRequest={this.movePrev}
      onMoveNextRequest={this.moveNext}
      toolbarButtons={[
        <button title="Toggle notes" onClick={this.toggleDescription} style={[buttonStyle, { background: `${icons.Info} no-repeat center` }]} type="button" />,
      ]}
      imageTitle={description}
    />);
  }
}
Lightbox2.propTypes = {
  photos: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Photo)).isRequired,
  index: React.PropTypes.number.isRequired,
  closeLightbox: React.PropTypes.func.isRequired,
};

