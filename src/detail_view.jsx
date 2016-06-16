import React from 'react';
import Colors from './colors.js';
import verge from 'verge';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import * as svgIcons from 'material-ui/svg-icons';
import { fade } from 'material-ui/utils/colorManipulator';
import * as utils from './utils.js';
import Swipeable from 'react-swipeable';

// objectFit does not work on IE and Edge http://caniuse.com/#search=object-fit
import objectFitImages from 'object-fit-images';
objectFitImages();

export default class DetailView extends React.Component {
  constructor() {
    super();

    this.state = { showInfo: true };

    this.handleResize = this.updateMenuWidth.bind(this);
    this.handleSwipedLeft = this.handleSwipedLeft.bind(this);
    this.handleSwipedRight = this.handleSwipedRight.bind(this);
    this.closeDetailView = this.closeDetailView.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
    this.moveNext = this.moveNext.bind(this);
    this.movePrev = this.movePrev.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentDidMount() {
    this.updateMenuWidth();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
    window.removeEventListener('keydown', this.handleKeyDown, false);
  }
  updateMenuWidth() {
    const newWidth = verge.viewportW();
    if (newWidth !== this.state.menuWidth) {
      this.setState({ menuWidth: newWidth });
    }
  }

  closeDetailView() {
    if (window.history.length > 1) {
      this.context.router.goBack();
    } else {
      // User opened lightbox url directly
      this.context.router.replace(`/chara/${this.props.chara}`);
    }
  }
  toggleInfo() {
    this.setState({ showInfo: !this.state.showInfo });
  }
  moveToIndex(index) {
    const photo = this.state.photos[index];
    this.context.router.replace(`/chara/${this.props.chara}/${window.encodeURIComponent(photo.data.title)}`);
    utils.sendGoogleAnalyticsEvent('lightbox', 'navigate', `${this.props.chara} ${photo.data.title}`);
  }
  moveNext(e) {
    e.preventDefault();
    this.moveToIndex((this.state.index + 1) % this.state.photos.length);
  }
  movePrev(e) {
    e.preventDefault();
    this.moveToIndex((this.state.index + this.state.photos.length - 1) % this.state.photos.length);
  }
  handleSwipedLeft(e, deltaX, isFlick) {
    if (isFlick) this.moveNext(e);
  }
  handleSwipedRight(e, deltaX, isFlick) {
    if (isFlick) this.movePrev(e);
  }
  handleKeyDown(e) {
    if (this.state.photos == null) return; // Don't handle any unless opened
    if (e.altKey || e.ctrlKey || e.shiftKey) return; // Don't handle keyboard shortcuts
    switch (e.keyCode) {
      case 37: // left
        this.movePrev(e);
        break;
      case 39: // right
        this.moveNext(e);
        break;
      default:
        break;
    }
  }
  createColorSampleStyle(colorValue) {
    const theme = this.context.muiTheme;
    return {
      display: 'inline-block',
      width: '0.8em',
      height: '0.8em',
      margin: '0 0.2em 0',
      border: `${theme.palette.borderColor} 1px solid`,
      backgroundColor: colorValue,
    };
  }
  createColorSample(photo) {
    if (photo.data.colors.length === 0) return null;
    return (
      <li>{photo.data.colors.map(c => {
        const color = Colors.findById(c);
        return <span style={this.createColorSampleStyle(color.value)} title={color.name}></span>;
      })}</li>
    );
  }
  createNotesElement(photo) {
    const theme = this.context.muiTheme;
    const prefilledTitle = `${photo.data.title} ${photo.data.source.url}`;
    const formUrl = `https://docs.google.com/forms/d/13YG0Yw-qcVFyk1mvz9WsBK0lIowT_sGvi4vDmzDKjuU/viewform?entry.2146921250=${encodeURIComponent(prefilledTitle)}&entry.111224920`;
    return [
      this.createColorSample(photo),
      ...photo.data.notes.map(n => <li>{n}</li>),
      <li><a href={formUrl} target="_blank" style={{ color: theme.palette.textColor }}>記述内容の修正などを報告</a></li>,
    ];
  }
  createCreditElement(photo) {
    const texts = [];
    if (photo.data.source.author) texts.push(`by ${photo.data.source.author}`);
    if (photo.data.source.license) texts.push(`under ${photo.data.source.license}`);
    const theme = this.context.muiTheme;
    return (
      <a href={photo.data.source.url} target="_blank" style={{ color: theme.appBar.textColor }}>
        {texts.join(' ') || 'no credit info'}
      </a>
    );
  }
  render() {
    if (this.state.photos == null) {
      return <Drawer open={false} openSecondary docked />;
    }
    const index = this.state.index;
    const len = this.state.photos.length;
    const main = this.state.photos[index];
    const next = this.state.photos[(index + 1) % len];
    const prev = this.state.photos[(index + len - 1) % len];
    const theme = this.context.muiTheme;
    const navSize = 24;
    const navPadding = 12;
    const navIconStyle = { width: navSize, height: navSize, fill: theme.palette.textColor };
    const navButtonStyle = { width: navSize + 2 * navPadding, height: navSize + 2 * navPadding, padding: navPadding };
    return (
      <Drawer
        open openSecondary docked
        onRequestChange={this.closeDetailView}
        width={this.state.menuWidth}
        containerStyle={{ backgroundColor: fade(theme.palette.canvasColor, 0.8) }}
      >
        <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
          {this.state.showInfo ?
            <AppBar
              style={{ height: '72px' }}
              titleStyle={{ height: '100px' }}
              iconElementLeft={<IconButton onTouchTap={this.closeDetailView}><svgIcons.NavigationArrowBack /></IconButton>}
              title={
                <div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{main.data.title}</div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', margin: '-40px 0 0', fontSize: '60%' }}>{this.createCreditElement(main)}</div>
                </div>}
            />
            : null}
          <Swipeable
            style={{ position: 'absolute', top: (this.state.showInfo ? '72px' : 0), bottom: 0, width: '100%' }}
            onTouchTap={this.toggleInfo}
            onSwipedLeft={this.handleSwipedLeft}
            onSwipedRight={this.handleSwipedRight}
          >
            <img style={{ width: '100%', height: '100%' }} className="image-fit" src={main.inferLargeImage()} alt="*" />
            <img style={{ display: 'none' }} src={prev.inferLargeImage()} alt="*" />
            <img style={{ display: 'none' }} src={next.inferLargeImage()} alt="*" />
          </Swipeable>
          {this.state.showInfo ?
            <div style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: fade(theme.palette.canvasColor, 0.4) }}>
              <ul style={{ margin: `0.25em ${navButtonStyle.width}px`, padding: `0 0 0 ${navPadding}px`, color: theme.palette.textColor }}>
                {this.createNotesElement(main)}
              </ul>
            </div>
            : null}
          <div style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <IconButton onTouchTap={this.movePrev} iconStyle={navIconStyle} style={navButtonStyle}><svgIcons.NavigationChevronLeft /></IconButton>
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
            <IconButton onTouchTap={this.moveNext} iconStyle={navIconStyle} style={navButtonStyle}><svgIcons.NavigationChevronRight /></IconButton>
          </div>
          {this.state.showInfo ? null :
            <div style={{ position: 'absolute', top: 0, left: 0 }}>
              <IconButton onTouchTap={this.closeDetailView} iconStyle={navIconStyle} style={navButtonStyle}><svgIcons.NavigationArrowBack /></IconButton>
            </div>}
        </div>
      </Drawer>
    );
  }
}
DetailView.propTypes = {
  chara: React.PropTypes.string.isRequired,
};
DetailView.contextTypes = {
  router: React.PropTypes.object,
  muiTheme: React.PropTypes.object.isRequired,
};
