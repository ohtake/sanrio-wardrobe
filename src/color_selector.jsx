import React from 'react';
import Colors from './colors.js';

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
    this.state = { colors: props.colors };

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
      display: 'inline-block',
      margin: '0.2em 0',
      padding: '0.2em 0.5em',
      textDecoration: 'none',
      color: 'black',
      borderWidth: '0 0 0.25em',
    };
  }
  styleColor(c) {
    const style = this.styleBase();
    style.borderStyle = 'solid';
    style.borderColor = c.active ? c.strong : c.weak;
    style.backgroundColor = c.active ? c.weak : 'transparent';
    return style;
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
    return this.state.colors.filter(c => c.active).map(c => c.id);
  }
  render() {
    return (<div>
      <span style={this.styleBase()}>Color filter</span>
      {this.state.colors.map(c =>
        <a key={c.name} href="#" style={this.styleColor(c)} onClick={this.toggle} data={c.id}>
          {c.name}
        </a>)}
      <a href="#" onClick={this.clear} style={this.styleBase()}>CLEAR</a>
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
