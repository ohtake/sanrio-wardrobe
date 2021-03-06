import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
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

function Transition(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Slide direction="left" {...props} />;
}

class DetailView extends React.Component {
  constructor() {
    super();

    this.state = { showInfo: true, swipingRatio: 0 };

    this.handleResize = this.updateViewWidth.bind(this);
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
    this.updateViewWidth();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
    window.removeEventListener('keydown', this.handleKeyDown, false);
  }

  updateViewWidth() {
    const { viewWidth } = this.state;
    const newWidth = verge.viewportW();
    if (newWidth !== viewWidth) {
      this.setState({ viewWidth: newWidth });
    }
  }

  closeDetailView() {
    const { chara } = this.props;
    utils.getRouterHistory().replace(`/chara/${chara}`);
    this.setState({ showInfo: true });
  }

  handleMenuOpen(ev) {
    this.setState({ menuAnchorEl: ev.currentTarget });
  }

  handleMenuClose() {
    this.setState({ menuAnchorEl: null });
  }

  toggleInfo() {
    const { showInfo } = this.state;
    this.handleMenuClose();
    this.setState({ showInfo: !showInfo });
  }

  moveToIndex(index) {
    const { photos } = this.props;
    const { chara } = this.props;
    const photo = photos[index];
    utils.getRouterHistory().replace(`/chara/${chara}/${window.encodeURIComponent(photo.data.title)}`);
    utils.sendGoogleAnalyticsEvent('lightbox', 'navigate', `${chara} ${photo.data.title}`);
  }

  moveNext(e) {
    e.preventDefault();
    const { photos, index } = this.props;
    this.moveToIndex((index + 1) % photos.length);
  }

  movePrev(e) {
    e.preventDefault();
    const { photos, index } = this.props;
    this.moveToIndex(((index + photos.length) - 1) % photos.length);
  }

  openImageSource() {
    const { photos, index } = this.props;
    const photo = photos[index];
    window.open(photo.data.source.url);
  }

  handleSwiping(e, deltaX/* , deltaY, absX, absY, velocity */) {
    const { viewWidth } = this.state;
    const swipingRatio = deltaX / viewWidth;
    this.setState({ swipingRatio });
  }

  handleSwiped(e/* , deltaX, deltaY, isFlick */) {
    this.handleSwiping.flush();
    const { swipingRatio } = this.state;
    if (swipingRatio > swipingRatioThreshold) {
      this.moveNext(e);
    } else if (swipingRatio < -swipingRatioThreshold) {
      this.movePrev(e);
    }
    this.setState({ swipingRatio: 0 });
  }

  handleKeyDown(e) {
    const { photos } = this.props;
    if (photos == null) return; // Don't handle any unless opened
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
        {photo.data.colors.length > 0
          ? (
            <li>
              {photo.data.colors.map((c) => {
                const color = Colors.findById(c);
                return <span style={this.createColorSampleStyle(color.value)} title={color.name} />;
              })}
            </li>
          ) : null }
        {photo.data.notes.map((n) => <li>{n}</li>)}
      </React.Fragment>
    );
  }

  /**
   * @private
   * @param {Photo} photo
   * @returns {React.Node}
   */
  renderCreditElement(photo) {
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

  static renderMenuItem(handler, icon, primaryText, secondaryText = '') {
    return (
      <MenuItem onClick={handler}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primaryText} secondary={secondaryText} />
      </MenuItem>
    );
  }

  renderAppBar(main) {
    const { menuAnchorEl } = this.state;
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={this.closeDetailView}><NavigationArrowBack /></IconButton>
          <div style={{ flexGrow: 1 }}>
            <div>
              <Typography variant="title">{main.data.title}</Typography>
            </div>
            <div>
              <Typography variant="subheading">{this.renderCreditElement(main)}</Typography>
            </div>
          </div>
          <div>
            <IconButton onClick={this.handleMenuOpen}><NavigationMoreVert /></IconButton>
            <Menu open={Boolean(menuAnchorEl)} anchorEl={menuAnchorEl} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} transformOrigin={{ horizontal: 'right', vertical: 'bottom' }} onClose={this.handleMenuClose}>
              {DetailView.renderMenuItem(this.openImageSource, <ActionOpenInBrowser />, 'Open image source', 'Tap the credit')}
              {DetailView.renderMenuItem(this.toggleInfo, <NavigationFullscreen />, 'Fullscreen', 'Tap the image')}
              {DetailView.renderMenuItem(this.movePrev, <NavigationChevronLeft />, 'Move Previous', 'Swipe right / Left key')}
              {DetailView.renderMenuItem(this.moveNext, <NavigationChevronRight />, 'Move Next', 'Swipe left / Right key')}
              <Divider />
              {DetailView.renderMenuItem(utils.openFeedback, <ActionFeedback />, 'Feedback')}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    );
  }

  static renderFloatingIcon(iconElement, isTop, isLeft, handler) {
    const containerStyle = { position: 'absolute' };
    if (isTop) { containerStyle.top = 0; } else { containerStyle.bottom = 0; }
    if (isLeft) { containerStyle.left = 0; } else { containerStyle.right = 0; }
    return (
      <div style={containerStyle}>
        <IconButton onClick={handler}>{iconElement}</IconButton>
      </div>
    );
  }

  renderContent() {
    const { photos, index, theme } = this.props;
    const { viewWidth, swipingRatio, showInfo } = this.state;
    const len = photos.length;
    const main = photos[index];
    const next = photos[(index + 1) % len];
    const prev = photos[((index + len) - 1) % len];
    const imgBaseStyle = { position: 'absolute', width: '100%', height: '100%' };
    const imgMainStyle = assign(clone(imgBaseStyle), { opacity: (Math.abs(swipingRatio) <= swipingRatioThreshold) ? 1 : 0.5 });
    const imgPosition = viewWidth + theme.spacing.unit;
    // objectPosion should be declared in stylesheet so that object-fit-images polyfill works. Since IE and Edge do not handle swipe, no need to do it.
    const imgPrevStyle = assign(clone(imgBaseStyle), { left: -imgPosition, objectPosition: '100% 50%', opacity: (swipingRatio < -swipingRatioThreshold) ? 1 : 0.5 });
    const imgNextStyle = assign(clone(imgBaseStyle), { left: +imgPosition, objectPosition: '  0% 50%', opacity: (swipingRatio > +swipingRatioThreshold) ? 1 : 0.5 });

    return (
      <React.Fragment>
        {showInfo ? this.renderAppBar(main) : null}
        <Swipeable
          style={{
            position: 'absolute', top: (showInfo ? '64px' : 0), bottom: 0, left: (-swipingRatio * viewWidth), width: viewWidth,
          }}
          onClick={this.toggleInfo}
          onSwiping={this.handleSwiping}
          onSwiped={this.handleSwiped}
        >
          <img key={main.data.title} style={imgMainStyle} className="image-fit" src={main.getLargestImageAtMost(1080, 1350).url} alt="*" />
          <img key={next.data.title} style={imgNextStyle} className="image-fit" src={next.getLargestImageAtMost(1080, 1350).url} alt="*" />
          <img key={prev.data.title} style={imgPrevStyle} className="image-fit" src={prev.getLargestImageAtMost(1080, 1350).url} alt="*" />
        </Swipeable>
        {showInfo
          ? (
            <div style={{
              position: 'absolute', bottom: 0, width: '100%', backgroundColor: fade(theme.palette.background.default, 0.4),
            }}
            >
              <ul style={{ margin: `${theme.spacing.unit}px ${theme.spacing.unit * 5}px`, padding: '0 0 0 1.5em' }}>{this.createNotesElement(main)}</ul>
            </div>
          )
          : null}
        {DetailView.renderFloatingIcon(<NavigationChevronLeft />, false, true, this.movePrev)}
        {DetailView.renderFloatingIcon(<NavigationChevronRight />, false, false, this.moveNext)}
        {showInfo ? null : DetailView.renderFloatingIcon(<NavigationArrowBack />, true, true, this.closeDetailView)}
        {showInfo ? null : DetailView.renderFloatingIcon(<NavigationFullscreenExit />, true, false, this.toggleInfo)}
      </React.Fragment>
    );
  }

  render() {
    const { index, theme } = this.props;
    const isOpen = index >= 0;
    return (
      <Dialog open={isOpen} fullScreen onClose={this.closeDetailView} TransitionComponent={Transition} PaperProps={{ style: { overflow: 'hidden', backgroundColor: fade(theme.palette.background.paper, 0.8) } }}>
        {isOpen ? this.renderContent() : null}
      </Dialog>
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
export default withTheme()(DetailView);
