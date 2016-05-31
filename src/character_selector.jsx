import React from 'react';

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
  charas: [
    new CharacterItem('kt-kitty', 'KT キティ'),
    new CharacterItem('kt-mimmy', 'KT ミミィ'),
  ],
  defaultChara: 'kt-kitty',
  onChanged: null,
};
