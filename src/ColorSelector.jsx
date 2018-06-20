import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import ContentFilterList from '@material-ui/icons/FilterList';

import clone from 'lodash/clone';

import Colors from './colors';

class ColorItem {
  /**
   * @param {string} id
   * @param {string} name
   * @param {string} strong
   * @param {string} weak
   */
  constructor(id, name, strong, weak) {
    this.id = id;
    this.name = name;
    this.strong = strong;
    this.weak = weak;
  }
}

const styleBase = {
  margin: '0.2em 0',
  padding: '0.2em 0.5em',
  borderWidth: '0 0 0.25em',
  minWidth: 0,
  textTransform: 'none',
};

class ColorSelector extends React.Component {
  constructor() {
    super();
    this.state = { enabled: false, actives: {} };

    this.start = this.start.bind(this);
    this.toggle = this.toggle.bind(this);
    this.clear = this.clear.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.enabled !== this.state.enabled || prevState.actives !== this.state.actives) {
      const f = this.props.onChanged;
      if (f) f(this);
    }
  }
  /**
   * @param {ColorItem} c
   * @returns {object}
   */
  styleColor(c) {
    const style = clone(styleBase);
    const isActive = this.state.actives[c.id];
    if (isActive) style.color = 'black';
    style.borderStyle = 'solid';
    style.borderColor = isActive ? c.strong : c.weak;
    if (isActive) style.backgroundColor = c.weak;
    return style;
  }
  /** @returns {void} */
  start() {
    this.setState({ enabled: !this.state.enabled });
  }
  /**
   * @param {object} e Event args
   * @returns {void}
   */
  toggle(e) {
    e.preventDefault();
    const id = e.currentTarget.getAttribute('data');
    const actives = clone(this.state.actives);
    actives[id] = !actives[id];
    this.setState({ actives });
  }
  /**
   * @param {?object} e Event args
   * @returns {void}
   */
  clear(e) {
    if (e) e.preventDefault();
    this.setState({ actives: {} });
  }
  /** @returns {string[]} */
  listActiveIds() {
    if (!this.state.enabled) return [];
    return this.props.colors.filter(c => this.state.actives[c.id]).map(c => c.id);
  }
  /** @returns {boolean} */
  isFilterEnabled() {
    return this.state.enabled && Object.keys(this.state.actives).length > 0;
  }
  /**
   * @private
   * @returns {React.Node}
   */
  listButtons() {
    return (
      <React.Fragment>
        {this.props.colors.map(c => <Button key={c.name} onClick={this.toggle} data={c.id} style={this.styleColor(c)}>{c.name}</Button>)}
        <Button key="clear" onClick={this.clear} data="" style={styleBase} disabled={!this.isFilterEnabled()}>CLEAR</Button>
      </React.Fragment>
    );
  }
  render() {
    return (
      <div>
        <Button style={styleBase} onClick={this.start}><ContentFilterList className={this.props.classes.leftIcon} /> Color filter</Button>
        {this.state.enabled ? this.listButtons() : null}
      </div>);
  }
}
ColorSelector.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  colors: PropTypes.arrayOf(PropTypes.instanceOf(ColorItem)),
  onChanged: PropTypes.func,
};
ColorSelector.defaultProps = {
  colors: Colors.all.map(c => new ColorItem(c.id, c.name, c.standard, c.light)),
  onChanged: null,
};

export default withStyles(theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
}))(ColorSelector);
