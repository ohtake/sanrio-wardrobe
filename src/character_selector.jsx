import React from 'react';
import { Link } from 'react-router';

import DataFile from './data_file.js';

export default class CharacterSelector extends React.Component {
  constructor(props) {
    super();
    this.status = { charas: props.charas };
  }
  renderSmall() {
    const styleLi = {
      float: 'left',
      margin: '0.2em',
      listStyleType: 'none',
    };
    const styleActive = {
      backgroundColor: 'silver',
    };
    return (
      <div>
        <ul style={{ margin: 0, padding: 0 }}>
          {this.status.charas.map(c => <li key={c.name} style={styleLi}><Link to={`chara/${c.name}`} activeStyle={styleActive}>
            <img src={c.picUrl} width="24" height="24" alt="*" /> {c.getDisplayName()}
          </Link></li>)}
        </ul>
        <div style={{ clear: 'both' }}></div>
      </div>);
  }
  renderLarge() {
    const styleLi = {
      float: 'left',
      width: '150px',
      textAlign: 'center',
      margin: '0.5em',
      listStyleType: 'none',
    };
    return (
      <div>
        <ul style={{ margin: 0, padding: 0 }}>
          {this.status.charas.map(c => <li key={c.name} style={styleLi}><Link to={`chara/${c.name}`}>
            <img src={c.picUrl} width="150" height="150" alt="*" /><br />
            {c.getDisplayName()}
          </Link></li>)}
        </ul>
        <div style={{ clear: 'both' }}></div>
      </div>);
  }
  render() {
    switch (this.props.mode) {
      case 'large':
        return this.renderLarge();
      default:
        return this.renderSmall();
    }
  }
}

CharacterSelector.propTypes = {
  charas: React.PropTypes.arrayOf(React.PropTypes.instanceOf(DataFile)),
  mode: React.PropTypes.string,
};

CharacterSelector.defaultProps = {
  charas: DataFile.all,
  mode: '',
};
