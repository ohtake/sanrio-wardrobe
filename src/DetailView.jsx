import React from 'react';
import PropTypes from 'prop-types';
import HashRouter from 'react-router-dom/HashRouter';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { withTheme } from '@material-ui/core/styles';

import ActionFeedback from '@material-ui/icons/Feedback';
import ActionOpenInBrowser from '@material-ui/icons/OpenInBrowser';
import NavigationArrowBack from '@material-ui/icons/ArrowBack';
import NavigationChevronLeft from '@material-ui/icons/ChevronLeft';
import NavigationChevronRight from '@material-ui/icons/ChevronRight';
import NavigationFullscreen from '@material-ui/icons/Fullscreen';
import NavigationFullscreenExit from '@material-ui/icons/FullscreenExit';
import NavigationMoreVert from '@material-ui/icons/MoreVert';

import Swipeable from 'react-swipeable';

import { fade } from '@material-ui/core/styles/colorManipulator';
import assign from 'lodash/assign';
import clone from 'lodash/clone';
import throttle from 'lodash/throttle';
import verge from 'verge';

import Colors from './colors';
import Photo from './photo';
import * as utils from './utils';

const swipingRatioThreshold = 0.3;

class DetailView extends React.Component {
  constructor() {
    super();

    this.state = { showInfo: true, swipingRatio: 0 };

    this.handleResize = this.updateMenuWidth.bind(this);
    this.handleSwiping = throttle(this.handleSwiping.bind(this), 50);
    this.handleSwiped = this.handleSwiped.bind(this);
    this.closeDetailView = this.closeDetailView.bind(this);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.openImageSource = this.openImageSource.bind(this);
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
    this.context.router.history.replace(`/chara/${this.props.chara}`);
    // FIXME Don't set state manually
    this.state.showInfo = true;
  }
  handleMenuOpen(ev) {
    this.setState({ menuAnchorEl: ev.currentTarget });
  }
  handleMenuClose() {
    this.setState({ menuAnchorEl: null });
  }
  toggleInfo() {
    this.handleMenuClose();
    this.setState({ showInfo: !this.state.showInfo });
  }
  moveToIndex(index) {
    const photo = this.props.photos[index];
    this.context.router.history.replace(`/chara/${this.props.chara}/${window.encodeURIComponent(photo.data.title)}`);
    utils.sendGoogleAnalyticsEvent('lightbox', 'navigate', `${this.props.chara} ${photo.data.title}`);
  }
  moveNext(e) {
    e.preventDefault();
    this.moveToIndex((this.props.index + 1) % this.props.photos.length);
  }
  movePrev(e) {
    e.preventDefault();
    this.moveToIndex(((this.props.index + this.props.photos.length) - 1) % this.props.photos.length);
  }
  openImageSource() {
    const photo = this.props.photos[this.props.index];
    window.open(photo.data.source.url);
  }
  handleSwiping(e, deltaX/* , deltaY, absX, absY, velocity */) {
    const swipingRatio = deltaX / this.state.menuWidth;
    this.setState({ swipingRatio });
  }
  handleSwiped(e/* , deltaX, deltaY, isFlick */) {
    this.handleSwiping.flush();
    if (this.state.swipingRatio > swipingRatioThreshold) {
      this.moveNext(e);
    } else if (this.state.swipingRatio < -swipingRatioThreshold) {
      this.movePrev(e);
    }
    this.setState({ swipingRatio: 0 });
  }
  handleKeyDown(e) {
    if (this.props.photos == null) return; // Don't handle any unless opened
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
    const { theme } = this.props;
    return {
      display: 'inline-block',
      width: '0.8em',
      height: '0.8em',
      margin: '0 0.2em 0',
      border: `${theme.palette.divider} 1px solid`,
      backgroundColor: colorValue,
    };
  }
  /**
   * @private
   * @param {Photo} photo
   * @returns {React.Node}
   */
  createNotesElement(photo) {
    return (
      <React.Fragment>
        {photo.data.colors.length > 0 ?
          <li>
            {photo.data.colors.map((c) => {
              const color = Colors.findById(c);
              return <span style={this.createColorSampleStyle(color.value)} title={color.name} />;
            })}
          </li> : null }
        {photo.data.notes.map(n => <li>{n}</li>)}
      </React.Fragment>);
  }
  /**
   * @private
   * @param {Photo} photo
   * @returns {React.Node}
   */
  createCreditElement(photo) {
    const { theme } = this.props;
    const texts = [];
    if (photo.data.source.author) texts.push(`by ${photo.data.source.author}`);
    if (photo.data.source.license) texts.push(`under ${photo.data.source.license}`);
    return (
      <a href={photo.data.source.url} target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.text.primary }}>
        {texts.join(' ') || 'no credit info'}
      </a>
    );
  }
  renderAppBar(main) {
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={this.closeDetailView}><NavigationArrowBack /></IconButton>
          <div style={{ flexGrow: 1 }}>
            <div><Typography variant="title">{main.data.title}</Typography></div>
            <div><Typography variant="subheading">{this.createCreditElement(main)}</Typography></div>
          </div>
          <div>
            <IconButton onClick={this.handleMenuOpen}>
              <NavigationMoreVert />
            </IconButton>
            <Menu open={Boolean(this.state.menuAnchorEl)} anchorEl={this.state.menuAnchorEl} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} transformOrigin={{ horizontal: 'right', vertical: 'bottom' }} onClose={this.handleMenuClose}>
              <MenuItem onClick={this.openImageSource}>
                <ListItemIcon><ActionOpenInBrowser /></ListItemIcon>
                <ListItemText primary="Open image source" secondary="Tap the credit" />
              </MenuItem>
              <MenuItem onClick={this.toggleInfo}>
                <ListItemIcon><NavigationFullscreen /></ListItemIcon>
                <ListItemText primary="Fullscreen" secondary="Tap the image" />
              </MenuItem>
              <MenuItem onClick={this.movePrev}>
                <ListItemIcon><NavigationChevronLeft /></ListItemIcon>
                <ListItemText primary="Move Previous" secondary="Swipe right / Left key" />
              </MenuItem>
              <MenuItem onClick={this.moveNext}>
                <ListItemIcon><NavigationChevronRight /></ListItemIcon>
                <ListItemText primary="Move Next" secondary="Swipe left / Right key" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={utils.openFeedback}>
                <ListItemIcon><ActionFeedback /></ListItemIcon>
                <ListItemText primary="Feedback" />
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>);
  }
  render() {
    const { photos, index, theme } = this.props;
    if (index === undefined || index < 0 || !photos) {
      return <Drawer open={false} anchor="right" />;
    }
    const len = photos.length;
    const main = photos[index];
    const next = photos[(index + 1) % len];
    const prev = photos[((index + len) - 1) % len];
    const imgBaseStyle = { position: 'absolute', width: '100%', height: '100%' };
    const imgMainStyle = assign(clone(imgBaseStyle), { opacity: (Math.abs(this.state.swipingRatio) <= swipingRatioThreshold) ? 1 : 0.5 });
    const imgPosition = this.state.menuWidth + theme.spacing.unit;
    // objectPosion should be declared in stylesheet so that object-fit-images polyfill works. Since IE and Edge do not handle swipe, no need to do it.
    const imgPrevStyle = assign(clone(imgBaseStyle), { left: -imgPosition, objectPosition: '100% 50%', opacity: (this.state.swipingRatio < -swipingRatioThreshold) ? 1 : 0.5 });
    const imgNextStyle = assign(clone(imgBaseStyle), { left: +imgPosition, objectPosition: '  0% 50%', opacity: (this.state.swipingRatio > +swipingRatioThreshold) ? 1 : 0.5 });

    function floatingIcon(iconElement, isTop, isLeft, handler) {
      const containerStyle = { position: 'absolute' };
      if (isTop) { containerStyle.top = 0; } else { containerStyle.bottom = 0; }
      if (isLeft) { containerStyle.left = 0; } else { containerStyle.right = 0; }
      return <div style={containerStyle}><IconButton onClick={handler}>{iconElement}</IconButton></div>;
    }

    return (
      <Drawer
        open
        anchor="right"
      >
        <div style={{
          position: 'relative',
          width: this.state.menuWidth,
          height: '100%',
          overflow: 'hidden',
        }}
        >
          {this.state.showInfo ? this.renderAppBar(main) : null}
          <Swipeable
            style={{
              position: 'absolute', top: (this.state.showInfo ? '72px' : 0), bottom: 0, left: (-this.state.swipingRatio * this.state.menuWidth), width: '100%',
            }}
            onTap={this.toggleInfo}
            onSwiping={this.handleSwiping}
            onSwiped={this.handleSwiped}
          >
            <img key={main.data.title} style={imgMainStyle} className="image-fit" src={main.getLargestImageAtMost(1080, 1350).url} alt="*" />
            <img key={next.data.title} style={imgNextStyle} className="image-fit" src={next.getLargestImageAtMost(1080, 1350).url} alt="*" />
            <img key={prev.data.title} style={imgPrevStyle} className="image-fit" src={prev.getLargestImageAtMost(1080, 1350).url} alt="*" />
          </Swipeable>
          {this.state.showInfo ?
            <div style={{
              position: 'absolute', bottom: 0, width: '100%', backgroundColor: fade(theme.palette.background.default, 0.4),
            }}
            >
              <ul style={{ margin: `${theme.spacing.unit}px ${theme.spacing.unit * 5}px`, padding: '0 0 0 1.5em' }}>
                {this.createNotesElement(main)}
              </ul>
            </div>
            : null}
          {floatingIcon(<NavigationChevronLeft />, false, true, this.movePrev)}
          {floatingIcon(<NavigationChevronRight />, false, false, this.moveNext)}
          {this.state.showInfo ? null : floatingIcon(<NavigationArrowBack />, true, true, this.closeDetailView)}
          {this.state.showInfo ? null : floatingIcon(<NavigationFullscreenExit />, true, false, this.toggleInfo)}
        </div>
      </Drawer>
    );
  }
}
DetailView.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  theme: PropTypes.object.isRequired,
  chara: PropTypes.string.isRequired,
  photos: PropTypes.arrayOf(PropTypes.instanceOf(Photo)),
  index: PropTypes.number,
};
DetailView.defaultProps = {
  photos: [],
  index: -1,
};
DetailView.contextTypes = {
  router: PropTypes.shape(HashRouter.propTypes).isRequired,
};
export default withTheme()(DetailView);
