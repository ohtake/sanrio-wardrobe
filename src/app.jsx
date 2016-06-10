import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, hashHistory } from 'react-router';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
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

import DataFile from './data_file.js';
import Home from './home.jsx';
import Character from './character.jsx';
import * as utils from './utils.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = { menuOpened: false, menuDocked: false };

    this.handleAppMenu = this.handleAppMenu.bind(this);
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuPinned = this.handleMenuPinned.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.menuWidth = 250;
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
  render() {
    const theme = this.context.muiTheme;
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
              {this.state.menuDocked ? <svgIcons.ActionTurnedIn /> : <svgIcons.ActionTurnedInNot />}
            </IconButton>
            <IconButton onClick={this.handleMenuClose}>
              <svgIcons.NavigationClose />
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
        </List>
      </Drawer>
      <div style={{ padding: '8px' }}>
        {this.props.children}
      </div>
    </div>);
  }
}
App.propTypes = utils.propTypesRoute;
App.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};

const theme = getMuiTheme({
  palette: {
    primary1Color: Colors.indigo500,
    primary2Color: Colors.indigo700,
    pickerHeaderColor: Colors.indigo500,
  },
});

ReactDOM.render((
  <MuiThemeProvider muiTheme={theme}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="chara/:chara(/:title)" component={Character} ref="chara" />
      </Route>
    </Router>
  </MuiThemeProvider>
), document.getElementById('app'));
