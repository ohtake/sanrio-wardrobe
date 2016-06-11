import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, hashHistory } from 'react-router';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import * as Colors from 'material-ui/styles/colors.js';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import * as svgIcons from 'material-ui/svg-icons';
import IconButton from 'material-ui/IconButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Toggle from 'material-ui/Toggle';

import DataFile from './data_file.js';
import Home from './home.jsx';
import Character from './character.jsx';
import * as utils from './utils.js';

// See https://github.com/callemall/material-ui/tree/master/src/styles for theme definition
const themeLight = getMuiTheme({
  palette: {
    primary1Color: Colors.indigo500,
    primary2Color: Colors.indigo700,
    pickerHeaderColor: Colors.indigo500,
  },
});
const themeDark = getMuiTheme(darkBaseTheme, {
  palette: {
    primary1Color: Colors.indigo500,
    primary2Color: Colors.indigo300,
    accent2Color: Colors.grey700,
    pickerHeaderColor: Colors.indigo500,
  },
  appBar: {
    textColor: Colors.fullWhite,
  },
});

let elStyle = null;
function applyThemeToBody(theme) {
  document.body.style.color = theme.palette.textColor;
  document.body.style.backgroundColor = theme.palette.canvasColor;
  document.body.style.fontFamily = theme.fontFamily;
  if (elStyle != null) {
    document.head.removeChild(elStyle);
  }
  elStyle = document.createElement('style');
  document.head.appendChild(elStyle);
  const stylesheet = elStyle.sheet;
  stylesheet.insertRule(`a { color: ${theme.palette.primary2Color}; }`, stylesheet.cssRules.length);
}
function getInitialTheme() {
  const h = new Date().getHours();
  const isDaytime = h >= 6 && h < 18;
  return isDaytime ? themeLight : themeDark;
}
const themeInitial = getInitialTheme();
applyThemeToBody(themeInitial);

class App extends React.Component {
  constructor() {
    super();
    this.state = { menuOpened: false, menuDocked: false, theme: themeInitial };

    this.handleAppMenu = this.handleAppMenu.bind(this);
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuPinned = this.handleMenuPinned.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleThemeToggle = this.handleThemeToggle.bind(this);
    this.menuWidth = 250;
  }
  getChildContext() {
    return {
      muiTheme: this.state.theme,
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
    const newTheme = this.refs.theme.state.switched ? themeLight : themeDark;
    applyThemeToBody(newTheme);
    this.setState({ theme: newTheme });
  }
  render() {
    const theme = this.state.theme;
    const containerStyle = {
      color: theme.palette.textColor,
      backgroundColor: theme.palette.canvasColor,
      padding: theme.spacing.desktopGutterMini,
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
            <Link key={c.name} to={`/chara/${c.name}`} onClick={this.handleMenuClick} activeStyle={activeStyle}>
              <ListItem primaryText={c.getDisplayName()} leftAvatar={<Avatar src={c.picUrl} />} />
            </Link>)}
          <Divider />
          <Subheader>Settings</Subheader>
          <ListItem>
            <Toggle ref="theme" label="Dark theme" onToggle={this.handleThemeToggle} defaultToggled={themeInitial === themeDark} />
          </ListItem>
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
};

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="chara/:chara(/:title)" component={Character} ref="chara" />
    </Route>
  </Router>
), document.getElementById('app'));
