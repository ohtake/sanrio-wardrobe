import React from 'react';
import HashRouter from 'react-router-dom/HashRouter';

import TextField from 'material-ui/TextField';

import ActionSearch from 'material-ui/svg-icons/action/search';

import throttle from 'lodash/throttle';

import ColorSelector from './ColorSelector';
import DataFile from './data_file';
import DetailView from './DetailView';
import Gallery from './Gallery';

import Photo from './photo';
import * as utils from './utils';

class SearchParams {
  constructor() {
    this.clear();
  }
  /** @returns {boolean} */
  isEmpty() {
    if (this.regexps.length) return false;
    if (this.colorIds.length) return false;
    return true;
  }
  clear() {
    this.regexps = [];
    this.colorIds = [];
  }
  /**
   * @param {Photo} photo
   * @returns {boolean}
   */
  match(photo) {
    if (!this.regexps.every(re => photo.match(re))) return false;
    if (!this.colorIds.every(c => photo.data.colors.indexOf(c) >= 0)) return false;
    return true;
  }
}

export default class Character extends React.Component {
  constructor() {
    super();
    this.state = { message: 'Initializing' };
    this.searchParams = new SearchParams();

    this.colorChanged = this.colorChanged.bind(this);
    this.handleSearchIconClick = this.handleSearchIconClick.bind(this);
    this.handleSearchTextChanged = throttle(this.handleSearchTextChanged.bind(this), 500);
    this.handleSearchTextKeyDown = this.handleSearchTextKeyDown.bind(this);
    this.handleSearchTextBlur = this.handleSearchTextBlur.bind(this);
  }
  componentDidMount() {
    const chara = this.props.match.params.chara;
    const df = DataFile.findByName(chara);
    this.context.setTitle(df.getDisplayName());
    this.clearSearch();
    this.loadPhotos(this.props.match.params.chara);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.chara !== this.props.match.params.chara) {
      const chara = nextProps.match.params.chara;
      const df = DataFile.findByName(chara);
      this.context.setTitle(df.getDisplayName());
      this.clearSearch();
      this.loadPhotos(nextProps.match.params.chara);
    }
    this.updateLightbox(nextProps.match.params.title);
  }
  /**
   * @private
   * @param {string} file
   */
  loadPhotos(file) {
    this.setState({
      photos: null,
      message: `Loading ${file}`,
    });
    Photo.loadPhotos(file).then((photos) => {
      this.allPhotos = photos;
      this.setState({
        photos: photos.slice(0),
        message: null,
      });
      this.updateLightbox(this.props.match.params.title);
    }).catch((err) => {
      this.setState({
        photos: null,
        message: err.toString(),
      });
    });
  }
  /**
   * @private
   * @param {string?} title
   */
  updateLightbox(title) {
    if (title) {
      if (this.state.photos) {
        const index = this.state.photos.findIndex(p => title === p.data.title);
        if (index >= 0) {
          this.lightbox.setState({ photos: this.state.photos, index });
          return;
        }
        this.context.router.history.replace(`/chara/${this.props.match.params.chara}`);
      }
    }
    this.lightbox.setState({ photos: null, index: 0 });
  }
  execSearch() {
    if (!this.state.photos) return;
    if (this.searchParams.isEmpty()) {
      this.setState({ photos: this.allPhotos, message: null });
    } else {
      const photos = this.allPhotos.filter(p => this.searchParams.match(p));
      this.setState({ photos, message: `Displaying ${photos.length} of ${this.allPhotos.length} items` });
    }
  }
  clearSearch() {
    this.searchParams.clear();
    this.text.input.value = '';
    this.color.clear();
  }
  handleSearchIconClick() {
    this.text.input.focus();
  }
  handleSearchTextChanged() {
    const textbox = this.text;
    const text = textbox.getValue();
    const terms = text.split(/[ \u3000]/).filter(t => t.length > 0); // U+3000 = full width space
    const termsEscaped = terms.map(t => t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const res = termsEscaped.map(te => new RegExp(te, 'i'));
    this.searchParams.regexps = res;
    this.execSearch();
  }
  handleSearchTextKeyDown(e) {
    switch (e.keyCode) {
      case 13: // Enter
        this.text.input.blur(); // To hide keyboard on mobile phones
        e.preventDefault();
        break;
      default:
        break;
    }
  }
  handleSearchTextBlur() {
    const text = this.text.getValue().trim();
    if (text) {
      utils.sendGoogleAnalyticsEvent('textsearch', 'blur', `${this.props.match.params.chara} ${text}`);
    }
  }
  colorChanged(sender) {
    const colors = sender.listActiveIds();
    this.searchParams.colorIds = colors;
    this.execSearch();
  }
  render() {
    const theme = this.context.muiTheme;
    return (
      <div>
        <ColorSelector ref={(c) => { this.color = c; }} onChanged={this.colorChanged} />
        <ActionSearch color={theme.palette.textColor} style={{ padding: '0 8px 0 12px' }} onClick={this.handleSearchIconClick} />
        <TextField ref={(c) => { this.text = c; }} hintText="Search text" onChange={this.handleSearchTextChanged} onKeyDown={this.handleSearchTextKeyDown} onBlur={this.handleSearchTextBlur} />
        {this.state.message ? <div>{this.state.message}</div> : null}
        <Gallery ref={(c) => { this.gallery = c; }} photos={this.state.photos} chara={this.props.match.params.chara} />
        <DetailView ref={(c) => { this.lightbox = c; }} chara={this.props.match.params.chara} />
      </div>
    );
  }
}
Character.propTypes = {
  match: React.PropTypes.shape({
    params: React.PropTypes.shape({
      chara: React.PropTypes.string,
      title: React.PropTypes.string,
    }),
  }).isRequired,
};
Character.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
  router: React.PropTypes.shape(HashRouter.propTypes).isRequired,
  setTitle: React.PropTypes.func,
};
