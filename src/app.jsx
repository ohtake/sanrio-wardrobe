import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import * as svgIcons from 'material-ui/svg-icons';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Toggle from 'material-ui/Toggle';
import Slider from 'material-ui/Slider';

import DataFile from './data_file.js';
import Home from './home.jsx';
import Character from './character.jsx';
import * as utils from './utils.js';
import * as themes from './themes.js';

class App extends React.Component {
  constructor() {
    super();

    const themeInitial = themes.getInitialTheme();
    themes.applyThemeToBody(themeInitial);

    this.state = { menuOpened: false, menuDocked: false, theme: themeInitial, thumbnailSize: 72 };

    this.handleAppMenu = this.handleAppMenu.bind(this);
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuPinned = this.handleMenuPinned.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleThemeToggle = this.handleThemeToggle.bind(this);
    this.handleThumbnailSizeChange = this.handleThumbnailSizeChange.bind(this);
    this.handleFeedback = this.handleFeedback.bind(this);
    this.menuWidth = 250;
  }
  getChildContext() {
    return {
      muiTheme: this.state.theme,
      thumbnailSize: this.state.thumbnailSize,
    };
  }
  getTitleFromParams() {
    const chara = this.props.params.chara;
    if (! chara) return 'Sanrio Wardrobe';
    const df = DataFile.findByName(chara);
    return df.getDisplayName();
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
  handleThemeToggle() {
    const newTheme = this.refs.theme.state.switched ? themes.themeLight : themes.themeDark;
    themes.applyThemeToBody(newTheme);
    this.setState({ theme: newTheme });
  }
  handleThumbnailSizeChange() {
    this.setState({ thumbnailSize: this.refs.thumbnailSize.state.value });
  }
  handleFeedback() {
    const formUrl = `https://docs.google.com/forms/d/13YG0Yw-qcVFyk1mvz9WsBK0lIowT_sGvi4vDmzDKjuU/viewform?entry.2146921250=${encodeURIComponent(window.location.href)}&entry.111224920`;
    window.open(formUrl);
  }
  render() {
    const theme = this.state.theme;
    const containerStyle = {
      color: theme.palette.textColor,
      backgroundColor: theme.palette.canvasColor,
      padding: theme.spacing.desktopGutterMini,
      marginTop: theme.appBar.height,
    };
    const activeStyle = {
      display: 'block',
      borderLeft: `8px solid ${theme.palette.primary1Color}`,
    };
    return (<div style={{ marginLeft: this.state.menuOpened && this.state.menuDocked ? this.menuWidth : 0 }}>
      <AppBar
        title={this.getTitleFromParams()}
        onLeftIconButtonTouchTap={this.handleAppMenu}
        showMenuIconButton={!this.state.menuOpened || !this.state.menuDocked}
        style={{ position: 'fixed', top: 0, left: (this.state.menuOpened && this.state.menuDocked ? this.menuWidth : 0), right: 0, width: null }}
        iconElementRight={
          <IconMenu iconButtonElement={<IconButton><svgIcons.ActionSettings /></IconButton>} targetOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
            <List>
              <ListItem leftIcon={<svgIcons.ImageColorLens />} onTouchTap={this.handleThemeToggle}>
                <Toggle ref="theme" label="Dark theme" defaultToggled={this.state.theme === themes.themeDark} />
              </ListItem>
              <ListItem leftIcon={<svgIcons.ImagePhotoSizeSelectLarge />}>
                <Slider ref="thumbnailSize" description={`Thumbnail size: ${this.state.thumbnailSize}`} defaultValue={this.state.thumbnailSize} min={36} max={288} step={1} onChange={this.handleThumbnailSizeChange} />
              </ListItem>
              <Divider />
              <ListItem primaryText="Feedback" leftIcon={<svgIcons.ActionFeedback />} onTouchTap={this.handleFeedback} />
            </List>
          </IconMenu>
        }
      />
      <Drawer open={this.state.menuOpened} docked={this.state.menuDocked} onRequestChange={this.handleMenuChange} containerClassName="appMenu" width={this.menuWidth}>
        <Toolbar>
          <ToolbarGroup firstChild>
            {/* Needs firstChild to align others to left */}
          </ToolbarGroup>
          <ToolbarGroup>
            <IconButton onClick={this.handleMenuPinned}>
              {this.state.menuDocked ? <svgIcons.ActionTurnedIn color={theme.palette.textColor} /> : <svgIcons.ActionTurnedInNot color={theme.palette.textColor} />}
            </IconButton>
            <IconButton onClick={this.handleMenuClose}>
              <svgIcons.NavigationClose color={theme.palette.textColor} />
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
        <List>
          <IndexLink to="/" onClick={this.handleMenuClick} activeStyle={activeStyle}>
            <ListItem primaryText="Home" leftIcon={<svgIcons.ActionHome />} />
          </IndexLink>
          <Divider />
          <Subheader>Characters</Subheader>
          {DataFile.all.map(c =>
            <Link key={c.name} to={`/chara/${c.name}`} onClick={this.handleMenuClick} activeStyle={activeStyle} data-event-category="chara" data-event-action="appMenu" data-event-label={c.name}>
              <ListItem primaryText={c.getDisplayName()} leftAvatar={<Avatar src={c.picUrl} />} />
            </Link>)}
        </List>
      </Drawer>
      <div style={containerStyle}>
        {this.props.children}
      </div>
    </div>);
  }
}
App.propTypes = utils.propTypesRoute;
App.childContextTypes = {
  muiTheme: React.PropTypes.object,
  thumbnailSize: React.PropTypes.number,
};

ReactDOM.render((
  <Router history={useRouterHistory(createHashHistory)({ queryKey: false })}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="chara/:chara(/:title)" component={Character} ref="chara" />
    </Route>
  </Router>
), document.getElementById('app'));
