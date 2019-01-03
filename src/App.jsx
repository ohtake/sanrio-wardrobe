import React from 'react';
import PropTypes from 'prop-types';
import NavLink from 'react-router-dom/NavLink';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import { withStyles } from '@material-ui/core/styles';

import ActionFeedback from '@material-ui/icons/Feedback';
import ActionHome from '@material-ui/icons/Home';
import ActionSettings from '@material-ui/icons/Settings';
import ActionTurnedIn from '@material-ui/icons/TurnedIn';
import ActionTurnedInNot from '@material-ui/icons/TurnedInNot';
import EditorShowChart from '@material-ui/icons/ShowChart';
import ImagePhotoSizeSelectLarge from '@material-ui/icons/PhotoSizeSelectLarge';
import NavigationClose from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';

import Home from './Home';
import Character from './Character';
import Statistics from './Statistics';

import DataFile from './data_file';
import * as utils from './utils';

const appDefaultTitle = 'Sanrio Wardrobe';

/**
 * Application root component
 */
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      menuOpened: false, menuDocked: false, thumbnailSize: 120, title: appDefaultTitle, errorObject: null, errorInfo: null,
    };

    this.refSliderThumbnailSize = React.createRef();

    this.setTitle = this.setTitle.bind(this);
    this.clearError = this.clearError.bind(this);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuPinned = this.handleMenuPinned.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleSettingsOpen = this.handleSettingsOpen.bind(this);
    this.handleSettingsClose = this.handleSettingsClose.bind(this);
    this.handleThumbnailSizeChange = this.handleThumbnailSizeChange.bind(this);
    this.menuWidth = 250;
  }

  getChildContext() {
    const { thumbnailSize } = this.state;
    return {
      thumbnailSize,
      setTitle: this.setTitle,
    };
  }

  /**
   * @param {string} title
   * @returns {void}
   */
  setTitle(title) {
    if (title) {
      this.setState({ title });
    } else {
      this.setState({ title: appDefaultTitle });
    }
  }

  componentDidCatch(error, info) {
    const { errorObject } = this.state;
    if (!errorObject) this.setState({ errorObject: error, errorInfo: info });
  }

  clearError() {
    this.setState({ errorObject: null, errorInfo: null });
  }

  handleMenuOpen() {
    this.setState({ menuOpened: true });
  }

  handleMenuPinned() {
    const { menuDocked } = this.state;
    this.setState({ menuDocked: !menuDocked });
  }

  handleMenuClose() {
    this.setState({ menuOpened: false });
  }

  handleMenuClick() {
    const { menuDocked } = this.state;
    this.clearError();
    if (menuDocked) return;
    window.setTimeout(() => this.setState({ menuOpened: false }), 200);
  }

  handleSettingsOpen(ev) {
    this.setState({ menuSettingsAnchorEl: ev.currentTarget });
  }

  handleSettingsClose() {
    this.setState({ menuSettingsAnchorEl: null });
  }

  handleThumbnailSizeChange(event, value) {
    this.setState({ thumbnailSize: value });
  }

  renderAppBar() {
    const {
      menuOpened, menuDocked, title, menuSettingsAnchorEl, thumbnailSize,
    } = this.state;
    return (
      <AppBar position="static">
        <Toolbar>
          {!menuOpened || !menuDocked
            ? <IconButton onClick={this.handleMenuOpen}><MenuIcon /></IconButton>
            : null }
          <div style={{ flexGrow: 1 }}>
            <Typography variant="title">{title}</Typography>
          </div>
          <div>
            <IconButton onClick={this.handleSettingsOpen}><ActionSettings /></IconButton>
            <Menu open={Boolean(menuSettingsAnchorEl)} anchorEl={menuSettingsAnchorEl} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} transformOrigin={{ horizontal: 'right', vertical: 'top' }} onClose={this.handleSettingsClose}>
              <MenuItem>
                <ListItemIcon><ImagePhotoSizeSelectLarge /></ListItemIcon>
                <ListItemText>
                  {`Thumbnail size: ${thumbnailSize}`}
                  <Slider ref={this.refSliderThumbnailSize} value={thumbnailSize} min={30} max={360} step={1} onChange={this.handleThumbnailSizeChange} />
                </ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={utils.openFeedback}>
                <ListItemIcon><ActionFeedback /></ListItemIcon>
                <ListItemText>Feedback</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    );
  }

  renderNavLink(to, icon, text, gaLabel) {
    const { classes } = this.props;
    return (
      <ListItem button component={NavLink} to={to} exact onClick={this.handleMenuClick} activeClassName={classes.activeNavLink} data-ga-on="click" data-ga-event-category="navigation" data-ga-event-action="appMenu" data-ga-event-label={gaLabel}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </ListItem>
    );
  }

  renderNavChara(chara) {
    const { classes } = this.props;
    const avatar = chara.picUrl ? <Avatar src={chara.picUrl} /> : <Avatar>{chara.seriesSymbol}</Avatar>;
    return (
      <ListItem button component={NavLink} to={`/chara/${chara.name}`} exact onClick={this.handleMenuClick} activeClassName={classes.activeNavLink} data-ga-on="click" data-ga-event-category="chara" data-ga-event-action="appMenu" data-ga-event-label={chara.name}>
        <ListItemAvatar>{avatar}</ListItemAvatar>
        <ListItemText>{chara.getDisplayName()}</ListItemText>
      </ListItem>
    );
  }

  renderDrawer() {
    const { menuOpened, menuDocked } = this.state;
    return (
      <Drawer open={menuOpened} variant={menuDocked ? 'persistent' : 'temporary'} onClose={this.handleMenuClose}>
        <div style={{ width: this.menuWidth, overflowX: 'hidden' }}>
          <Toolbar>
            <div style={{ flexGrow: 1 }} />
            <IconButton onClick={this.handleMenuPinned}>
              {menuDocked ? <ActionTurnedIn color="action" /> : <ActionTurnedInNot color="action" />}
            </IconButton>
            <IconButton onClick={this.handleMenuClose}><NavigationClose color="action" /></IconButton>
          </Toolbar>
          <Divider />
          <List>
            {this.renderNavLink('/', <ActionHome />, 'Home', 'home')}
            {this.renderNavLink('/statistics', <EditorShowChart />, 'Statistics', 'statistics')}
          </List>
          <Divider />
          <List subheader={<ListSubheader>Characters</ListSubheader>}>
            {DataFile.all.map(c => this.renderNavChara(c)) }
          </List>
        </div>
      </Drawer>
    );
  }

  renderError() {
    const { classes } = this.props;
    const { errorObject, errorInfo } = this.state;
    return (
      <Paper className={classes.errorBox}>
        <p>{errorObject.toString()}</p>
        <pre>{errorInfo.componentStack}</pre>
        <Button onClick={this.clearError}>Retry</Button>
        <Button component={NavLink} onClick={this.clearError} to="/">Back to Home</Button>
      </Paper>
    );
  }

  render() {
    const { menuOpened, menuDocked, errorObject } = this.state;
    const { classes } = this.props;
    return (
      <div style={{ marginLeft: menuOpened && menuDocked ? this.menuWidth : 0 }}>
        {this.renderAppBar()}
        {this.renderDrawer()}
        <div className={classes.container}>
          {errorObject ? this.renderError() : (
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/chara/:chara/:title?" component={Character} />
              <Route path="/statistics" component={Statistics} />
            </Switch>
          )}
        </div>
      </div>
    );
  }
}
App.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
};
App.childContextTypes = {
  thumbnailSize: PropTypes.number,
  setTitle: PropTypes.func,
};
export default withStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit,
  },
  errrorBox: {
    border: `2px solid ${theme.palette.error.main}`,
    padding: theme.spacing.unit,
  },
  activeNavLink: {
    backgroundColor: theme.palette.action.selected,
  },
}))(App);
