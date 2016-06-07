import React from 'react';
import RLightbox from 'react-image-lightbox';
import Styles from 'react-image-lightbox/lib/Styles.js';
import icons from './icons';
import Colors from './colors.js';

// Drawer of Material-UI has 1300 zIndex
Styles.outer.zIndex = 1400;

const myStyles = {
  creditContainer: {
    position: 'fixed',
    top: Styles.toolbar.height,
    left: 0,
    padding: `0 0.4em 0.4em ${Styles.toolbarLeftSide.paddingLeft}`,
    lineHeight: '1em',
    fontSize: '80%',
    backgroundColor: Styles.toolbar.backgroundColor,
  },
  creditAnchor: {
    color: Styles.toolbarItem.color,
  },
  notesContainer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    padding: '0.4em 0',
    width: '100%',
    backgroundColor: Styles.toolbar.backgroundColor,
  },
  notesList: {
    whiteSpace: 'normal',
    lineHeight: '1em',
    fontSize: '80%',
  },
  report: {
    color: Styles.toolbarItem.color,
  },
  buttonNotes: [
    Styles.toolbarItemChild,
    Styles.builtinButton,
    { fill: 'white' },
  ],
  colorSample: {
    display: 'inline-block',
    width: '0.8em',
    height: '0.8em',
    margin: '0 0.2em 0',
    border: 'grey 1px solid',
  },
};

export default class Lightbox2 extends React.Component {
  constructor() {
    super();

    this.state = { showDescription: true };

    this.moveNext = this.moveNext.bind(this);
    this.movePrev = this.movePrev.bind(this);
    this.toggleDescription = this.toggleDescription.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
  }
  closeLightbox() {
    if (window.history.length > 1) {
      this.context.router.goBack();
    } else {
      // User opened lightbox url directly
      this.context.router.replace(`/chara/${this.props.chara}`);
    }
  }
  moveToIndex(index) {
    const photo = this.state.photos[index];
    this.context.router.replace(`/chara/${this.props.chara}/${window.encodeURIComponent(photo.data.title)}`);
  }
  moveNext() {
    this.moveToIndex((this.state.index + 1) % this.state.photos.length);
  }
  movePrev() {
    this.moveToIndex((this.state.index + this.state.photos.length - 1) % this.state.photos.length);
  }
  toggleDescription(e) {
    e.preventDefault();
    this.setState({ showDescription: ! this.state.showDescription });
  }
  createColorSample(photo) {
    if (photo.data.colors.length === 0) return null;
    return (
      <li>{photo.data.colors.map(c => {
        const color = Colors.findById(c);
        return <span style={[myStyles.colorSample, { backgroundColor: color.value }]} title={color.name}></span>;
      })}</li>
    );
  }
  createNotesElement(photo) {
    const prefilledTitle = `${photo.data.title} ${photo.data.source.url}`;
    const formUrl = `https://docs.google.com/forms/d/13YG0Yw-qcVFyk1mvz9WsBK0lIowT_sGvi4vDmzDKjuU/viewform?entry.2146921250=${encodeURIComponent(prefilledTitle)}&entry.111224920`;
    return (
      <div style={myStyles.notesContainer}>
        <ul style={myStyles.notesList}>
          {this.createColorSample(photo)}
          {photo.data.notes.map(n => <li>{n}</li>)}
          <li><a href={formUrl} target="_blank" style={myStyles.report}>記述内容についての修正などを報告</a></li>
        </ul>
      </div>);
  }
  createCreditElement(photo) {
    const texts = [];
    if (photo.data.source.author) texts.push(`by ${photo.data.source.author}`);
    if (photo.data.source.license) texts.push(`under ${photo.data.source.license}`);
    return (
      <div style={myStyles.creditContainer}>
        <a href={photo.data.source.url} target="_blank" style={myStyles.creditAnchor}>
          {texts.join(' ') || 'no credit info'}
        </a>
      </div>
    );
  }
  render() {
    if (this.state.photos == null) {
      return null;
    }
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
      onCloseRequest={this.closeLightbox}
      onMovePrevRequest={this.movePrev}
      onMoveNextRequest={this.moveNext}
      toolbarButtons={[
        <svg viewBox="-4 -4 32 32" title="Toggle notes" onClick={this.toggleDescription} style={myStyles.buttonNotes}>
          <path d={icons.InfoOutline} />
        </svg>,
      ]}
      imageTitle={description}
    />);
  }
}
Lightbox2.propTypes = {
  chara: React.PropTypes.string.isRequired,
};
Lightbox2.contextTypes = {
  router: React.PropTypes.object,
};
