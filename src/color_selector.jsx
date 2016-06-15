import React from 'react';
import Colors from './colors.js';
import FlatButton from 'material-ui/FlatButton';
import * as svgIcons from 'material-ui/svg-icons';

class ColorItem {
  constructor(id, name, strong, weak) {
    this.id = id;
    this.name = name;
    this.strong = strong;
    this.weak = weak;
    this.active = false;
  }
  toggle() {
    this.active = !this.active;
  }
}

export default class ColorSelector extends React.Component {
  constructor(props) {
    super();
    this.state = { colors: props.colors, enabled: false };

    this.start = this.start.bind(this);
    this.toggle = this.toggle.bind(this);
    this.clear = this.clear.bind(this);
  }
  onChanged() {
    const f = this.props.onChanged;
    if (f) f(this);
  }
  getColorById(id) {
    for (const c of this.state.colors) {
      if (c.id === id) return c;
    }
    return null;
  }
  styleBase() {
    return {
      margin: '0.2em 0',
      padding: '0.2em 0.5em',
      borderWidth: '0 0 0.25em',
      minWidth: 0,
    };
  }
  styleColor(c) {
    const style = this.styleBase();
    if (c.active) style.color = 'black';
    style.borderStyle = 'solid';
    style.borderColor = c.active ? c.strong : c.weak;
    if (c.active) style.backgroundColor = c.weak;
    return style;
  }
  start() {
    this.state.enabled = !this.state.enabled;
    this.onChanged();
    this.setState({ enabled: this.state.enabled });
  }
  toggle(e) {
    e.preventDefault();
    const id = e.currentTarget.getAttribute('data');
    const c = this.getColorById(id);
    c.toggle();
    this.onChanged();
    this.setState({ colors: this.state.colors });
  }
  clear(e) {
    if (e) e.preventDefault();
    for (const c of this.state.colors) {
      c.active = false;
    }
    this.onChanged();
    this.setState({ colors: this.state.colors });
  }
  listActiveIds() {
    if (! this.state.enabled) return [];
    return this.state.colors.filter(c => c.active).map(c => c.id);
  }
  isFilterEnabled() {
    return this.state.enabled && this.state.colors.some(c => c.active);
  }
  listButtons() {
    return [
      ...this.state.colors.map(c =>
        <a key={c.name} href="#" onClick={this.toggle} data={c.id}>
          <FlatButton label={c.name} style={this.styleColor(c)} labelStyle={{ padding: 0, textTransform: 'none' }} />
        </a>),
      <a key="clear" href="#" onClick={this.clear}>
        <FlatButton label="CLEAR" style={this.styleBase()} labelStyle={{ padding: 0, textTransform: 'none' }} disabled={! this.isFilterEnabled()} />
      </a>,
    ];
  }
  render() {
    return (<div>
      <FlatButton label="Color filter" labelStyle={{ textTransform: 'none' }} icon={<svgIcons.ContentFilterList />} onClick={this.start} />
      {this.state.enabled ? this.listButtons() : null}
    </div>);
  }
}
ColorSelector.propTypes = {
  colors: React.PropTypes.arrayOf(React.PropTypes.instanceOf(ColorItem)),
  onChanged: React.PropTypes.func,
};
ColorSelector.defaultProps = {
  colors: Colors.all.map(c => new ColorItem(c.id, c.name, c.standard, c.light)),
  onChanged: null,
};
ColorSelector.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};
