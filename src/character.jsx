import React from 'react';

import _ from 'lodash';
import Photo from './photo.js';
import TextField from 'material-ui/TextField';
import ColorSelector from './color_selector.jsx';
import Gallery from './gallery.jsx';
import DetailView from './detail_view.jsx';
import * as utils from './utils.js';

import ActionSearch from 'material-ui/svg-icons/action/search';

class SearchParams {
  constructor() {
    this.clear();
  }
  isEmpty() {
    if (this.regexps.length) return false;
    if (this.colorIds.length) return false;
    return true;
  }
  clear() {
    this.regexps = [];
    this.colorIds = [];
  }
  match(photo) {
    if (this.regexps.length && ! this.regexps.every(re => photo.match(re))) return false;
    if (this.colorIds.length) {
      for (const c of this.colorIds) {
        if (photo.data.colors.indexOf(c) < 0) return false;
      }
    }
    return true;
  }
}

export default class Character extends React.Component {
  constructor(props) {
    super();
    this.state = { filename: props.params.chara, message: 'Initializing' };
    this.searchParams = new SearchParams();

    this.colorChanged = this.colorChanged.bind(this);
    this.handleSearchIconClick = this.handleSearchIconClick.bind(this);
    this.handleSearchTextChanged = _.throttle(this.handleSearchTextChanged.bind(this), 500);
    this.handleSearchTextKeyDown = this.handleSearchTextKeyDown.bind(this);
    this.handleSearchTextBlur = this.handleSearchTextBlur.bind(this);
  }
  componentDidMount() {
    this.clearSearch();
    this.loadPhotos(this.props.params.chara);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.chara !== this.props.params.chara) {
      this.clearSearch();
      this.loadPhotos(nextProps.params.chara);
    }
    this.updateLightbox(nextProps);
  }
  loadPhotos(file) {
    this.setState({
      photos: null,
      message: `Loading ${file}`,
    });
    Photo.loadPhotos(file, (ok, result) => {
      if (ok) {
        this.allPhotos = result;
        this.setState({
          photos: result.slice(0),
          message: null,
        });
        this.updateLightbox(this.props);
      } else {
        this.setState({
          photos: null,
          message: result.toString(),
        });
      }
    });
  }
  updateLightbox(props) {
    const title = props.params.title;
    if (title) {
      const index = this.state.photos.findIndex(p => title === p.data.title);
      if (index >= 0) {
        this.lightbox.setState({ photos: this.state.photos, index });
        return;
      }
      this.context.router.replace(`/chara/${this.props.params.chara}`);
    }
    this.lightbox.setState({ photos: null, index: 0 });
  }
  execSearch() {
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
    const termsEscaped = terms.map(t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const res = termsEscaped.map(te => new RegExp(te, 'i'));
    this.searchParams.regexps = res;
    this.execSearch();
  }
  handleSearchTextKeyDown(e) {
    switch (e.keyCode) {
      case 13: // Enter
        this.text.input.blur(); // To hide keyboard on mobile phones
        e.preventDefault();
        return;
      default:
        return;
    }
  }
  handleSearchTextBlur() {
    const text = this.text.getValue().trim();
    if (text) {
      utils.sendGoogleAnalyticsEvent('textsearch', 'blur', `${this.props.params.chara} ${text}`);
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
        <ColorSelector ref={c => { this.color = c; }} onChanged={this.colorChanged} />
        <ActionSearch color={theme.palette.textColor} style={{ padding: '0 8px 0 12px' }} onClick={this.handleSearchIconClick} />
        <TextField ref={c => { this.text = c; }} hintText="Search text" onChange={this.handleSearchTextChanged} onKeyDown={this.handleSearchTextKeyDown} onBlur={this.handleSearchTextBlur} />
        {this.state.message ? <div>{this.state.message}</div> : null}
        <Gallery ref={c => { this.gallery = c; }} photos={this.state.photos} chara={this.props.params.chara} />
        <DetailView ref={c => { this.lightbox = c; }} chara={this.props.params.chara} />
      </div>
    );
  }
}
Character.propTypes = utils.propTypesRoute;
Character.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
  router: React.PropTypes.object,
};
