import React from 'react';
import { Link } from 'react-router';

import DataFile from './data_file.js';

class CharacterItem {
  constructor(filename, name) {
    this.filename = filename;
    this.name = name;
  }
}

export default class CharacterSelector extends React.Component {
  constructor(props) {
    super();
    this.status = { charas: props.charas };
  }
  render() {
    return (
      <div>
        <ul>
          {this.status.charas.map(c => <li><Link to={`chara/${c.filename}`} activeStyle={{ backgroundColor: 'silver' }}>{c.name}</Link></li>)}
        </ul>
      </div>);
  }
}

CharacterSelector.propTypes = {
  charas: React.PropTypes.arrayOf(React.PropTypes.instanceOf(CharacterItem)),
  defaultChara: React.PropTypes.string,
};

CharacterSelector.defaultProps = {
  charas: DataFile.all.map(df => new CharacterItem(df.name, df.getDisplayName())),
  defaultChara: DataFile.ktKitty.name,
};
