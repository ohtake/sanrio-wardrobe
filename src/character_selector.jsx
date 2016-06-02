import React from 'react';
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
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    const f = this.props.onChanged;
    if (f) f(e.target.value);
  }
  selected() {
    return this.refs.select.value;
  }
  render() {
    return (
      <div>Character
        <select ref="select" defaultValue={this.props.defaultChara} onChange={this.handleChange}>
          {this.status.charas.map(c => <option value={c.filename}>{c.name}</option>)}
        </select>
      </div>);
  }
}

CharacterSelector.propTypes = {
  charas: React.PropTypes.arrayOf(React.PropTypes.instanceOf(CharacterItem)),
  defaultChara: React.PropTypes.string,
  onChanged: React.PropTypes.func,
};

CharacterSelector.defaultProps = {
  charas: DataFile.all.map(df => new CharacterItem(df.name, df.getDisplayName())),
  defaultChara: DataFile.ktKitty.name,
  onChanged: null,
};
