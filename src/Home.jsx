import React from 'react';
import PropTypes from 'prop-types';
import RouterLink from 'react-router-dom/Link';

import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import EditorShowChart from 'material-ui/svg-icons/editor/show-chart';

import curry from 'lodash/curry';

import JustifiedLayout from './JustifiedLayout';
import FullWidthContainer from './FullWidthContainer';
import DataFile from './data_file';

const styleSymbol = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '0.2em',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  color: 'white',
};
const styleTitleOuter = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  color: 'white',
};
const styleTitleInner = {
  margin: '0.2em',
};
const styleImg = {
  width: '100%',
  height: '100%',
};

/**
 * @private
 * @param {string} gaEventAction
 * @param {DataFile} c
 * @returns {React.Element}
 */
function renderTile(gaEventAction, c) {
  return (
    <RouterLink key={c.name} to={`/chara/${c.name}`} data-ga-on="click" data-ga-event-category="chara" data-ga-event-action={gaEventAction} data-ga-event-label={c.name}>
      <div>
        <div style={styleSymbol}>{c.seriesSymbol}</div>
        <div style={styleTitleOuter}>
          <div style={styleTitleInner}>{c.nameJa}</div>
          <div style={styleTitleInner}>{c.nameEn}</div>
        </div>
        {c.picUrl ? <img src={c.picUrl} alt="*" style={styleImg} /> : <Avatar style={styleImg}>{c.seriesSymbol}</Avatar>}
      </div>
    </RouterLink>
  );
}

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    this.context.setTitle();
  }
  render() {
    const featured = [
      DataFile.ktKitty,
      DataFile.mmMelody,
      DataFile.tsKikiLala,
      DataFile.xoBadtzmaru,
      DataFile.cnCinnamon,
      DataFile.pnPurin,
    ];
    return (
      <div>
        <a href="https://github.com/ohtake/sanrio-wardrobe">
          <img
            alt="Fork me on GitHub"
            style={{
              position: 'absolute', top: this.context.muiTheme.appBar.height, right: 0, border: 0,
            }}
            src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67"
            data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
          />
        </a>
        <p style={{ paddingRight: '150px' }}>Unofficial listings of Sanrio character costumes</p>
        <RouterLink to="/statistics" data-ga-on="click" data-ga-event-category="navigation" data-ga-event-action="homeTile" data-ga-event-label="statistics">
          <FlatButton label="Statistics" icon={<EditorShowChart />} />
        </RouterLink>
        <h2>Featured characters</h2>
        <FullWidthContainer
          renderElement={width => (
            <JustifiedLayout targetRowHeight={this.context.thumbnailSize} containerWidth={width} childObjects={featured} mapperToElement={curry(renderTile)('featured')} />
          )}
        />
        <h2>All characters</h2>
        <FullWidthContainer
          renderElement={width => (
            <JustifiedLayout targetRowHeight={this.context.thumbnailSize} containerWidth={width} childObjects={DataFile.all} mapperToElement={curry(renderTile)('all')} />
          )}
        />
        <h2>License</h2>
        <ul>
          <li>Sanrio characters are registered trademarks of <a href="https://www.sanrio.co.jp/">Sanrio Co., Ltd.</a></li>
          <li>Each photo was taken by respective author</li>
          <li>This software is provided under <a href="https://opensource.org/licenses/MIT">MIT License</a></li>
          <li><a href="assets/licenses.txt">Attribution notices for third party software</a></li>
        </ul>
        <h2>Documents and reports</h2>
        <ul>
          <li><a href="assets/esdoc/index.html">ESDoc</a></li>
          <li><a href="coverage/lcov-report/index.html">LCOV code coverage</a></li>
          <li><a href="assets/sme.html">Source map explorer</a></li>
        </ul>
      </div>
    );
  }
}
Home.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
  setTitle: PropTypes.func,
  thumbnailSize: PropTypes.number,
};
