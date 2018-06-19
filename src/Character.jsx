import React from 'react';
import PropTypes from 'prop-types';
import HashRouter from 'react-router-dom/HashRouter';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import ActionSearch from '@material-ui/icons/Search';

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
    this.allPhotos = [];
    this.state = { message: 'Initializing', photos: [] };
    this.searchParams = new SearchParams();

    this.refColor = React.createRef();
    this.refText = React.createRef();

    this.colorChanged = this.colorChanged.bind(this);
    this.handleSearchIconClick = this.handleSearchIconClick.bind(this);
    this.handleSearchTextChanged = throttle(this.handleSearchTextChanged.bind(this), 500);
    this.handleSearchTextKeyDown = this.handleSearchTextKeyDown.bind(this);
    this.handleSearchTextBlur = this.handleSearchTextBlur.bind(this);
  }
  static getDerivedStateFromProps(nextProps) {
    const { chara, title } = nextProps.match.params;
    return { chara, title };
  }
  componentDidMount() {
    this.loadPhotos();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.photos !== nextState.photos
      || this.state.chara !== nextState.chara
      || this.state.title !== nextState.title
      || this.state.message !== nextState.message
      || this.state.index !== nextState.index;
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.chara !== this.state.chara) {
      this.loadPhotos();
    } else if (prevState.title !== this.state.title) {
      this.updateLightbox(this.state.title);
    }
  }
  /**
   * @private
   * @returns {void}
   */
  loadPhotos() {
    const df = DataFile.findByName(this.state.chara);
    this.context.setTitle(df.getDisplayName());
    this.setState({
      photos: [],
      message: `Loading ${this.state.chara}`,
    });
    this.loadPhotosAsync();
  }
  async loadPhotosAsync() {
    try {
      const photos = await Photo.loadPhotos(this.state.chara);
      this.allPhotos = photos;
      this.setState({
        photos: photos.slice(0),
        message: null,
      });
      this.clearSearch();
      this.updateLightbox(this.state.title);
    } catch (err) {
      this.setState({
        photos: [],
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
          this.setState({ index });
        } else {
          this.context.router.history.replace(`/chara/${this.state.chara}`);
        }
      }
    } else {
      this.setState({ index: -1 });
    }
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
    this.refText.current.value = '';
    this.refColor.current.clear();
  }
  handleSearchIconClick() {
    this.refText.current.focus();
  }
  handleSearchTextChanged() {
    const text = this.refText.current.value;
    const terms = text.split(/[ \u3000]/).filter(t => t.length > 0); // U+3000 = full width space
    const termsEscaped = terms.map(t => t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const res = termsEscaped.map(te => new RegExp(te, 'i'));
    this.searchParams.regexps = res;
    this.execSearch();
  }
  handleSearchTextKeyDown(e) {
    switch (e.keyCode) {
      case 13: // Enter
        this.refText.current.blur(); // To hide keyboard on mobile phones
        e.preventDefault();
        break;
      default:
        break;
    }
  }
  handleSearchTextBlur() {
    const text = this.refText.current.value.trim();
    if (text) {
      utils.sendGoogleAnalyticsEvent('textsearch', 'blur', `${this.state.chara} ${text}`);
    }
  }
  colorChanged(sender) {
    const colors = sender.listActiveIds();
    this.searchParams.colorIds = colors;
    this.execSearch();
  }
  render() {
    return (
      <React.Fragment>
        <ColorSelector innerRef={this.refColor} onChanged={this.colorChanged} />
        <Grid container alignItems="flex-end">
          <Grid item>
            <ActionSearch style={{ padding: '0 8px 0 12px' }} />
          </Grid>
          <Grid item>
            <TextField inputRef={this.refText} placeholder="Search text" onChange={this.handleSearchTextChanged} onKeyDown={this.handleSearchTextKeyDown} onBlur={this.handleSearchTextBlur} />
          </Grid>
        </Grid>
        {this.state.message ? <div>{this.state.message}</div> : <div style={{ height: 8 }} /> }
        <Gallery photos={this.state.photos} chara={this.state.chara} />
        <DetailView chara={this.state.chara} photos={this.state.photos} index={this.state.index} />
      </React.Fragment>
    );
  }
}
Character.propTypes = {
  // https://github.com/yannickcr/eslint-plugin-react/issues/1751
  // eslint-disable-next-line react/no-unused-prop-types
  match: PropTypes.shape({
    params: PropTypes.shape({
      chara: PropTypes.string,
      title: PropTypes.string,
    }),
  }).isRequired,
};
Character.contextTypes = {
  router: PropTypes.shape(HashRouter.propTypes).isRequired,
  setTitle: PropTypes.func,
};
