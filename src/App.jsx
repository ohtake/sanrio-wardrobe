import React from 'react';
import IndexLink from 'react-router/lib/IndexLink';
import Link from 'react-router/lib/Link';

import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Slider from 'material-ui/Slider';

import ActionFeedback from 'material-ui/svg-icons/action/feedback';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionTurnedIn from 'material-ui/svg-icons/action/turned-in';
import ActionTurnedInNot from 'material-ui/svg-icons/action/turned-in-not';
import ImageColorLens from 'material-ui/svg-icons/image/color-lens';
import ImagePhotoSizeSelectLarge from 'material-ui/svg-icons/image/photo-size-select-large';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import DataFile from './data_file.js';
import * as themes from './themes.js';
import * as utils from './utils.js';

export default
/**
 * Application root component
 */
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
    this.menuWidth = 250;
  }
  getChildContext() {
    return {
      muiTheme: this.state.theme,
      thumbnailSize: this.state.thumbnailSize,
    };
  }
  /**
   * @private
   * @returns {string}
   */
  getTitleFromParams() {
    const chara = this.props.params.chara;
    if (!chara) return 'Sanrio Wardrobe';
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
    const newTheme = this.theme.state.switched ? themes.themeLight : themes.themeDark;
    themes.applyThemeToBody(newTheme);
    this.setState({ theme: newTheme });
  }
  handleThumbnailSizeChange() {
    this.setState({ thumbnailSize: this.thumbnailSize.state.value });
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
          <IconMenu iconButtonElement={<IconButton><ActionSettings /></IconButton>} targetOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
            <List>
              <ListItem leftIcon={<ImageColorLens />} onTouchTap={this.handleThemeToggle}>
                <Toggle ref={c => { this.theme = c; }} label="Dark theme" defaultToggled={this.state.theme === themes.themeDark} />
              </ListItem>
              <ListItem leftIcon={<ImagePhotoSizeSelectLarge />}>
                <Slider ref={c => { this.thumbnailSize = c; }} description={`Thumbnail size: ${this.state.thumbnailSize}`} defaultValue={this.state.thumbnailSize} min={36} max={288} step={1} onChange={this.handleThumbnailSizeChange} />
              </ListItem>
              <Divider />
              <ListItem primaryText="Feedback" leftIcon={<ActionFeedback />} onTouchTap={utils.openFeedback} />
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
              {this.state.menuDocked ? <ActionTurnedIn color={theme.palette.textColor} /> : <ActionTurnedInNot color={theme.palette.textColor} />}
            </IconButton>
            <IconButton onClick={this.handleMenuClose}>
              <NavigationClose color={theme.palette.textColor} />
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
        <List>
          <IndexLink to="/" onClick={this.handleMenuClick} activeStyle={activeStyle}>
            <ListItem primaryText="Home" leftIcon={<ActionHome />} />
          </IndexLink>
          <Divider />
          <Subheader>Characters</Subheader>
          {DataFile.all.map(c =>
            <Link key={c.name} to={`/chara/${c.name}`} onClick={this.handleMenuClick} activeStyle={activeStyle} data-ga-on="click" data-ga-event-category="chara" data-ga-event-action="appMenu" data-ga-event-label={c.name}>
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
App.propTypes = {
  children: React.PropTypes.node,
  params: React.PropTypes.shape({
    chara: React.PropTypes.string,
  }),
};
App.childContextTypes = {
  muiTheme: React.PropTypes.object,
  thumbnailSize: React.PropTypes.number,
};
