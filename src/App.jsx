import React from 'react';
import PropTypes from 'prop-types';
import NavLink from 'react-router-dom/NavLink';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';

import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Slider from 'material-ui/Slider';

import ActionFeedback from '@material-ui/icons/Feedback';
import ActionHome from '@material-ui/icons/Home';
import ActionSettings from '@material-ui/icons/Settings';
import ActionTurnedIn from '@material-ui/icons/TurnedIn';
import ActionTurnedInNot from '@material-ui/icons/TurnedInNot';
import EditorShowChart from '@material-ui/icons/ShowChart';
import ImagePhotoSizeSelectLarge from '@material-ui/icons/PhotoSizeSelectLarge';
import NavigationClose from '@material-ui/icons/Close';

import Home from './Home';
import Character from './Character';
import Statistics from './Statistics';

import DataFile from './data_file';
import * as themes from './themes';
import * as utils from './utils';

const appDefaultTitle = 'Sanrio Wardrobe';

export default
/**
 * Application root component
 */
class App extends React.Component {
  constructor() {
    super();

    const themeInitial = themes.themeDark;
    themes.applyThemeToBody(themeInitial);

    this.state = {
      menuOpened: false, menuDocked: false, theme: themeInitial, thumbnailSize: 120, title: appDefaultTitle,
    };

    this.refSliderThumbnailSize = React.createRef();

    this.setTitle = this.setTitle.bind(this);
    this.handleAppMenu = this.handleAppMenu.bind(this);
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuPinned = this.handleMenuPinned.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleThumbnailSizeChange = this.handleThumbnailSizeChange.bind(this);
    this.menuWidth = 250;
  }
  getChildContext() {
    return {
      muiTheme: this.state.theme,
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
  handleAppMenu(/* e */) {
    this.setState({ menuOpened: !this.state.menuOpened });
  }
  handleMenuChange(open /* , reason */) {
    this.setState({ menuOpened: open });
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
  handleThumbnailSizeChange() {
    this.setState({ thumbnailSize: this.refSliderThumbnailSize.current.state.value });
  }
  renderAppBar() {
    return (
      <AppBar
        title={this.state.title}
        onLeftIconButtonClick={this.handleAppMenu}
        showMenuIconButton={!this.state.menuOpened || !this.state.menuDocked}
        style={{
          position: 'fixed', top: 0, left: (this.state.menuOpened && this.state.menuDocked ? this.menuWidth : 0), right: 0, width: null,
        }}
        iconElementRight={
          <IconMenu iconButtonElement={<IconButton><ActionSettings /></IconButton>} targetOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
            <List>
              <ListItem leftIcon={<ImagePhotoSizeSelectLarge />}>
                <span>Thumbnail size: {this.state.thumbnailSize}</span>
                <Slider ref={this.refSliderThumbnailSize} defaultValue={this.state.thumbnailSize} min={30} max={360} step={1} onChange={this.handleThumbnailSizeChange} />
              </ListItem>
              <Divider />
              <ListItem primaryText="Feedback" leftIcon={<ActionFeedback />} onClick={utils.openFeedback} />
            </List>
          </IconMenu>
        }
      />
    );
  }
  renderDrawer() {
    const { theme } = this.state;
    const activeStyle = {
      display: 'block',
      borderLeft: `8px solid ${theme.palette.primary1Color}`,
    };
    return (
      <Drawer open={this.state.menuOpened} docked={this.state.menuDocked} onRequestChange={this.handleMenuChange} containerClassName="appMenu" width={this.menuWidth}>
        <Toolbar>
          <ToolbarGroup firstChild>
            {/* Needs firstChild to align others to left */}
          </ToolbarGroup>
          <ToolbarGroup>
            <IconButton onClick={this.handleMenuPinned}>
              {this.state.menuDocked ? <ActionTurnedIn color={theme.palette.textColor} /> : <ActionTurnedInNot color={theme.palette.textColor} />}
            </IconButton>
            <IconButton onClick={this.handleMenuClose}>
              <NavigationClose color={theme.palette.textColor} />
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
        <List>
          <NavLink to="/" exact onClick={this.handleMenuClick} activeStyle={activeStyle} data-ga-on="click" data-ga-event-category="navigation" data-ga-event-action="appMenu" data-ga-event-label="home">
            <ListItem primaryText="Home" leftIcon={<ActionHome />} />
          </NavLink>
          <NavLink to="/statistics" onClick={this.handleMenuClick} activeStyle={activeStyle} data-ga-on="click" data-ga-event-category="navigation" data-ga-event-action="appMenu" data-ga-event-label="statistics">
            <ListItem primaryText="Statistics" leftIcon={<EditorShowChart />} />
          </NavLink>
          <Divider />
          <Subheader>Characters</Subheader>
          {DataFile.all.map(c => (
            <NavLink key={c.name} to={`/chara/${c.name}`} onClick={this.handleMenuClick} activeStyle={activeStyle} data-ga-on="click" data-ga-event-category="chara" data-ga-event-action="appMenu" data-ga-event-label={c.name}>
              <ListItem primaryText={c.getDisplayName()} leftAvatar={c.picUrl ? <Avatar src={c.picUrl} /> : <Avatar>{c.seriesSymbol}</Avatar>} />
            </NavLink>))}
        </List>
      </Drawer>);
  }
  render() {
    const { theme } = this.state;
    const containerStyle = {
      color: theme.palette.textColor,
      backgroundColor: theme.palette.canvasColor,
      padding: theme.spacing.desktopGutterMini,
      marginTop: theme.appBar.height,
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
};
App.childContextTypes = {
  muiTheme: PropTypes.object,
  thumbnailSize: PropTypes.number,
  setTitle: PropTypes.func,
};
