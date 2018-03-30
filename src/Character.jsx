import React from 'react';
import PropTypes from 'prop-types';
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

    this.refColor = React.createRef();
    this.refText = React.createRef();
    this.refLightbox = React.createRef();

    this.colorChanged = this.colorChanged.bind(this);
    this.handleSearchIconClick = this.handleSearchIconClick.bind(this);
    this.handleSearchTextChanged = throttle(this.handleSearchTextChanged.bind(this), 500);
    this.handleSearchTextKeyDown = this.handleSearchTextKeyDown.bind(this);
    this.handleSearchTextBlur = this.handleSearchTextBlur.bind(this);
  }
  componentDidMount() {
    const { chara } = this.props.match.params;
    const df = DataFile.findByName(chara);
    this.context.setTitle(df.getDisplayName());
    this.clearSearch();
    this.loadPhotos(this.props.match.params.chara);
  }
  componentWillReceiveProps(nextProps) {
    const { chara } = nextProps.match.params;
    if (chara !== this.props.match.params.chara) {
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
   * @returns {void}
   */
  async loadPhotos(file) {
    this.setState({
      photos: null,
      message: `Loading ${file}`,
    });
    try {
      const photos = await Photo.loadPhotos(file);
      this.allPhotos = photos;
      this.setState({
        photos: photos.slice(0),
        message: null,
      });
      this.updateLightbox(this.props.match.params.title);
    } catch (err) {
      this.setState({
        photos: null,
        message: err.toString(),
      });
    }
  }
  /**
   * @private
   * @param {string?} title
   * @returns {void}
   */
  updateLightbox(title) {
    if (title) {
      if (this.state.photos) {
        const index = this.state.photos.findIndex(p => title === p.data.title);
        if (index >= 0) {
          this.refLightbox.current.setState({ photos: this.state.photos, index });
          return;
        }
        this.context.router.history.replace(`/chara/${this.props.match.params.chara}`);
      }
    }
    this.refLightbox.current.setState({ photos: null, index: 0 });
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
    this.refText.current.input.value = '';
    this.refColor.current.clear();
  }
  handleSearchIconClick() {
    this.refText.current.input.focus();
  }
  handleSearchTextChanged() {
    const text = this.refText.current.getValue();
    const terms = text.split(/[ \u3000]/).filter(t => t.length > 0); // U+3000 = full width space
    const termsEscaped = terms.map(t => t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const res = termsEscaped.map(te => new RegExp(te, 'i'));
    this.searchParams.regexps = res;
    this.execSearch();
  }
  handleSearchTextKeyDown(e) {
    switch (e.keyCode) {
      case 13: // Enter
        this.refText.current.input.blur(); // To hide keyboard on mobile phones
        e.preventDefault();
        break;
      default:
        break;
    }
  }
  handleSearchTextBlur() {
    const text = this.refText.current.getValue().trim();
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
      <React.Fragment>
        <ColorSelector ref={this.refColor} onChanged={this.colorChanged} />
        <ActionSearch color={theme.palette.textColor} style={{ padding: '0 8px 0 12px' }} onClick={this.handleSearchIconClick} />
        <TextField ref={this.refText} hintText="Search text" onChange={this.handleSearchTextChanged} onKeyDown={this.handleSearchTextKeyDown} onBlur={this.handleSearchTextBlur} />
        {this.state.message ? <div>{this.state.message}</div> : null}
        <Gallery photos={this.state.photos} chara={this.props.match.params.chara} />
        <DetailView ref={this.refLightbox} chara={this.props.match.params.chara} />
      </React.Fragment>
    );
  }
}
Character.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      chara: PropTypes.string,
      title: PropTypes.string,
    }),
  }).isRequired,
};
Character.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
  router: PropTypes.shape(HashRouter.propTypes).isRequired,
  setTitle: PropTypes.func,
};
