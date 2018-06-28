import React from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
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
    this.state = { allPhotos: null, photos: [], error: null };
    this.searchParams = new SearchParams();

    this.refColor = React.createRef();
    this.refText = React.createRef();

    this.colorChanged = this.colorChanged.bind(this);
    this.handleSearchIconClick = this.handleSearchIconClick.bind(this);
    this.handleSearchTextChanged = throttle(this.handleSearchTextChanged.bind(this), 500);
    this.handleSearchTextKeyDown = this.handleSearchTextKeyDown.bind(this);
    this.handleSearchTextBlur = this.handleSearchTextBlur.bind(this);
  }

  componentDidMount() {
    this.loadPhotos();
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const {
      photos, chara, title, index, error,
    } = this.state;
    const { thumbnailSize } = this.context; // Workaround to unofficial old React Context API
    return photos !== nextState.photos
      || chara !== nextState.chara
      || title !== nextState.title
      || index !== nextState.index
      || error !== nextState.error
      || thumbnailSize !== nextContext.thumbnailSize;
  }

  componentDidUpdate(prevProps, prevState) {
    const { chara, title } = this.state;
    if (prevState.chara !== chara) {
      this.loadPhotos();
    } else if (prevState.title !== title) {
      this.updateLightbox(title);
    }
  }

  static getDerivedStateFromProps(nextProps) {
    const { chara, title } = nextProps.match.params;
    return { chara, title };
  }

  /**
   * @private
   * @returns {void}
   */
  loadPhotos() {
    const { chara } = this.state;
    const { setTitle } = this.context;
    const df = DataFile.findByName(chara);
    setTitle(df.getDisplayName());
    this.setState({
      allPhotos: null,
      photos: [],
    });
    this.loadPhotosAsync();
  }

  async loadPhotosAsync() {
    const { chara, title } = this.state;
    try {
      const photos = await Photo.loadPhotos(chara);
      this.setState({
        allPhotos: photos,
        photos,
      });
      this.clearSearch();
      this.updateLightbox(title);
    } catch (err) {
      this.setState({
        error: err,
      });
    }
  }

  /**
   * @private
   * @param {string?} title
   * @returns {void}
   */
  updateLightbox(title) {
    const { photos, chara } = this.state;
    const { router } = this.context;
    if (title) {
      if (photos) {
        const index = photos.findIndex(p => title === p.data.title);
        if (index >= 0) {
          this.setState({ index });
        } else {
          router.history.replace(`/chara/${chara}`);
        }
      }
    } else {
      this.setState({ index: -1 });
    }
  }

  execSearch() {
    const { allPhotos } = this.state;
    if (!allPhotos) return;
    if (this.searchParams.isEmpty()) {
      this.setState({ photos: allPhotos });
    } else {
      const photos = allPhotos.filter(p => this.searchParams.match(p));
      this.setState({ photos });
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
    const { chara } = this.state;
    if (text) {
      utils.sendGoogleAnalyticsEvent('textsearch', 'blur', `${chara} ${text}`);
    }
  }

  colorChanged(sender) {
    const colors = sender.listActiveIds();
    this.searchParams.colorIds = colors;
    this.execSearch();
  }

  render() {
    const {
      error, allPhotos, photos, chara, index,
    } = this.state;
    const message = (allPhotos === null && [<CircularProgress />, `Loading ${chara}...`])
      || (!this.searchParams.isEmpty() && `Displaying ${photos.length} of ${allPhotos.length} items`)
      || null;
    if (error) throw error;
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
        {message ? (
          <div>
            {message}
          </div>
        ) : <div style={{ height: 8 }} /> }
        <Gallery photos={photos} chara={chara} />
        <DetailView chara={chara} photos={photos} index={index} />
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
  router: PropTypes.shape({ history: PropTypes.shape({ replace: PropTypes.func }) }).isRequired,
  setTitle: PropTypes.func,
  thumbnailSize: PropTypes.number,
};
