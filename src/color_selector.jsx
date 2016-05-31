import React from 'react';
import * as Colors from 'material-ui/styles/colors.js';

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
        <a href="#" style={this.styleColor(c)} onClick={this.toggle} data={c.id}>
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
  colors: [
    new ColorItem('red', 'Red', Colors.red500, Colors.red200),
    new ColorItem('pink', 'Pink', Colors.red500, Colors.pink200),
    new ColorItem('orange', 'Orange', Colors.orange500, Colors.orange200),
    new ColorItem('yellow', 'Yellow', Colors.yellow500, Colors.yellow200),
    new ColorItem('green', 'Green', Colors.green500, Colors.green200),
    new ColorItem('blue', 'Blue', Colors.blue500, Colors.blue200),
    new ColorItem('purple', 'Purple', Colors.purple500, Colors.purple200),
    new ColorItem('brown', 'Brown', Colors.brown500, Colors.brown200),
    new ColorItem('black', 'Black', Colors.grey500, Colors.grey200),
    new ColorItem('grey', 'Grey', Colors.grey500, Colors.grey200),
    new ColorItem('silver', 'Silver', Colors.grey500, Colors.grey200),
    new ColorItem('white', 'White', Colors.grey500, Colors.grey200),
    new ColorItem('gold', 'Gold', Colors.amber500, Colors.amber200),
  ],
  onChanged: null,
};
