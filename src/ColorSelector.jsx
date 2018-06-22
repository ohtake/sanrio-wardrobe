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
    const { enabled, actives } = this.state;
    const { onChanged } = this.props;
    if (prevState.enabled !== enabled || prevState.actives !== actives) {
      if (onChanged) onChanged(this);
    }
  }

  /**
   * @param {ColorItem} c
   * @returns {object}
   */
  styleColor(c) {
    const { actives } = this.state;
    const isActive = actives[c.id];
    const style = clone(styleBase);
    if (isActive) style.color = 'black';
    style.borderStyle = 'solid';
    style.borderColor = isActive ? c.strong : c.weak;
    if (isActive) style.backgroundColor = c.weak;
    return style;
  }

  /** @returns {void} */
  start() {
    const { enabled } = this.state;
    this.setState({ enabled: !enabled });
  }

  /**
   * @param {object} e Event args
   * @returns {void}
   */
  toggle(e) {
    e.preventDefault();
    const { actives } = this.state;
    const id = e.currentTarget.getAttribute('data');
    const newActives = clone(actives);
    newActives[id] = !actives[id];
    this.setState({ actives: newActives });
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
    const { enabled, actives } = this.state;
    const { colors } = this.props;
    if (!enabled) return [];
    return colors.filter(c => actives[c.id]).map(c => c.id);
  }

  /** @returns {boolean} */
  isFilterEnabled() {
    const { enabled, actives } = this.state;
    return enabled && Object.keys(actives).length > 0;
  }

  /**
   * @private
   * @returns {React.Node}
   */
  listButtons() {
    const { colors } = this.props;
    return (
      <React.Fragment>
        {colors.map(c => (
          <Button key={c.name} onClick={this.toggle} data={c.id} style={this.styleColor(c)}>
            {c.name}
          </Button>
        ))}
        <Button key="clear" onClick={this.clear} data="" style={styleBase} disabled={!this.isFilterEnabled()}>
          CLEAR
        </Button>
      </React.Fragment>
    );
  }

  render() {
    const { classes } = this.props;
    const { enabled } = this.state;
    return (
      <div>
        <Button style={styleBase} onClick={this.start}>
          <ContentFilterList className={classes.leftIcon} />
          {' '}
          Color filter
        </Button>
        {enabled ? this.listButtons() : null}
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
