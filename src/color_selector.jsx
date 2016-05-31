import React from 'react';

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
        // Color values are taken from http://www.google.com/design/spec/style/color.html#color-color-palette
        // strong=500, weak=200
    new ColorItem('red', 'Red', '#f44336', '#ef9a9a'),
    new ColorItem('pink', 'Pink', '#e91e63', '#f48fb1'),
    new ColorItem('orange', 'Orange', '#ff9800', '#ffcc80'),
    new ColorItem('yellow', 'Yellow', '#ffeb3b', '#fff59d'),
    new ColorItem('green', 'Green', '#4caf50', '#a5d6a7'),
    new ColorItem('blue', 'Blue', '#2196f3', '#90caf9'),
    new ColorItem('purple', 'Purple', '#9c27b0', '#ce93d8'),
    new ColorItem('brown', 'Brown', '#795548', '#bcaaa4'),
    new ColorItem('black', 'Black', '#9e9e9e', '#eeeeee'),
    new ColorItem('grey', 'Grey', '#9e9e9e', '#eeeeee'),
    new ColorItem('silver', 'Silver', '#9e9e9e', '#eeeeee'),
    new ColorItem('white', 'White', '#9e9e9e', '#eeeeee'),
    new ColorItem('gold', 'Gold', '#ffc107', '#ffe082'),
  ],
  onChanged: null,
};
