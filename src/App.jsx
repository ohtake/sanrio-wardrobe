import React from 'react';
import PropTypes from 'prop-types';
import NavLink from 'react-router-dom/NavLink';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
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
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import { withTheme } from '@material-ui/core/styles';

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
      menuOpened: false, menuDocked: false, thumbnailSize: 120, title: appDefaultTitle,
    };

    this.refSliderThumbnailSize = React.createRef();

    this.setTitle = this.setTitle.bind(this);
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
    return {
      thumbnailSize: this.state.thumbnailSize,
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
  handleMenuOpen() {
    this.setState({ menuOpened: true });
  }
  handleMenuPinned() {
    this.setState({ menuDocked: !this.state.menuDocked });
  }
  handleMenuClose() {
    this.setState({ menuOpened: false });
  }
  handleMenuClick() {
    if (this.state.menuDocked) return;
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
    return (
      <AppBar position="static">
        <Toolbar>
          {!this.state.menuOpened || !this.state.menuDocked ?
            <IconButton onClick={this.handleMenuOpen}><MenuIcon /></IconButton> : null }
          <div style={{ flexGrow: 1 }}>
            <Typography variant="title">{this.state.title}</Typography>
          </div>
          <div>
            <IconButton onClick={this.handleSettingsOpen}>
              <ActionSettings />
            </IconButton>
            <Menu open={Boolean(this.state.menuSettingsAnchorEl)} anchorEl={this.state.menuSettingsAnchorEl} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} transformOrigin={{ horizontal: 'right', vertical: 'top' }} onClose={this.handleSettingsClose}>
              <MenuItem>
                <ListItemIcon><ImagePhotoSizeSelectLarge /></ListItemIcon>
                <ListItemText>
                  <span>Thumbnail size: {this.state.thumbnailSize}</span>
                  <Slider ref={this.refSliderThumbnailSize} value={this.state.thumbnailSize} min={30} max={360} step={1} onChange={this.handleThumbnailSizeChange} />
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
  renderDrawer() {
    const { theme } = this.props;
    const activeStyle = {
      borderLeft: `8px solid ${theme.palette.primary.main}`,
    };
    return (
      <Drawer open={this.state.menuOpened} variant={this.state.menuDocked ? 'persistent' : 'temporary'} onClose={this.handleMenuClose}>
        <div style={{ width: this.menuWidth, overflowX: 'hidden' }}>
          <Toolbar>
            <div style={{ flexGrow: 1 }} />
            <IconButton onClick={this.handleMenuPinned}>
              {this.state.menuDocked ? <ActionTurnedIn color="action" /> : <ActionTurnedInNot color="action" />}
            </IconButton>
            <IconButton onClick={this.handleMenuClose}>
              <NavigationClose color="action" />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            <ListItem button component={NavLink} to="/" exact onClick={this.handleMenuClick} activeStyle={activeStyle} data-ga-on="click" data-ga-event-category="navigation" data-ga-event-action="appMenu" data-ga-event-label="home">
              <ListItemIcon><ActionHome /></ListItemIcon>
              <ListItemText>Home</ListItemText>
            </ListItem>
            <ListItem button component={NavLink} to="/statistics" onClick={this.handleMenuClick} activeStyle={activeStyle} data-ga-on="click" data-ga-event-category="navigation" data-ga-event-action="appMenu" data-ga-event-label="statistics">
              <ListItemIcon><EditorShowChart /></ListItemIcon>
              <ListItemText>Statistics</ListItemText>
            </ListItem>
          </List>
          <Divider />
          <List subheader={<ListSubheader>Characters</ListSubheader>}>
            {DataFile.all.map(c => (
              <ListItem button component={NavLink} key={c.name} to={`/chara/${c.name}`} onClick={this.handleMenuClick} activeStyle={activeStyle} data-ga-on="click" data-ga-event-category="chara" data-ga-event-action="appMenu" data-ga-event-label={c.name}>
                <ListItemAvatar>{c.picUrl ? <Avatar src={c.picUrl} /> : <Avatar>{c.seriesSymbol}</Avatar>}</ListItemAvatar>
                <ListItemText>{c.getDisplayName()}</ListItemText>
              </ListItem>))}
          </List>
        </div>
      </Drawer>);
  }
  render() {
    const { theme } = this.props;
    const containerStyle = {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit,
    };
    return (
      <div style={{ marginLeft: this.state.menuOpened && this.state.menuDocked ? this.menuWidth : 0 }}>
        {this.renderAppBar()}
        {this.renderDrawer()}
        <div style={containerStyle}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/chara/:chara/:title?" component={Character} />
            <Route path="/statistics" component={Statistics} />
          </Switch>
        </div>
      </div>);
  }
}
App.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  theme: PropTypes.object.isRequired,
};
App.childContextTypes = {
  thumbnailSize: PropTypes.number,
  setTitle: PropTypes.func,
};
export default withTheme()(App);
