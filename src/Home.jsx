import React from 'react';
import Link from 'react-router-dom/Link';

import JustifiedLayout from './JustifiedLayout';
import DataFile from './data_file';
import * as utils from './utils';

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
 * @param {DataFile} c
 * @returns {React.Element}
 */
function renderTile(c) {
  return (
    <Link key={c.name} to={`/chara/${c.name}`} data-ga-on="click" data-ga-event-category="chara" data-ga-event-action="homeTile" data-ga-event-label={c.name}>
      <div>
        <div style={styleSymbol}>{c.seriesSymbol}</div>
        <div style={styleTitleOuter}>
          <div style={styleTitleInner}>{c.nameJa}</div>
          <div style={styleTitleInner}>{c.nameEn}</div>
        </div>
        <img src={c.picUrl} alt="*" style={styleImg} />
      </div>
    </Link>
  );
}

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.widthListener = new utils.ContainerClientWidthListener(this, () => this.grid, 'containerWidth');
  }
  componentDidMount() {
    this.context.setTitle();
    this.widthListener.componentDidMount();
  }
  componentDidUpdate(prevProps, prevState) {
    this.widthListener.componentDidUpdate(prevProps, prevState);
  }
  componentWillUnmount() {
    this.widthListener.componentWillUnmount();
  }
  render() {
    return (
      <div>
        <a href="https://github.com/ohtake/sanrio-wardrobe">
          <img
            alt="Fork me on GitHub"
            style={{ position: 'absolute', top: this.context.muiTheme.appBar.height, right: 0, border: 0 }}
            src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67"
            data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
          />
        </a>
        <p style={{ paddingRight: '150px' }}>You can find clothings of Sanrio characters.</p>
        <h2>Characters</h2>
        <div ref={(c) => { this.grid = c; }}>
          <JustifiedLayout targetRowHeight={150} containerWidth={this.state.containerWidth} childObjects={DataFile.all} mapperToElement={renderTile} />
        </div>
        <h2>License</h2>
        <ul>
          <li>Sanrio characters are registered trademarks of <a href="https://www.sanrio.co.jp/">Sanrio Co., Ltd.</a></li>
          <li>This software is provided under <a href="https://opensource.org/licenses/ISC">ISC License</a></li>
          <li><a href="assets/licenses.txt">Attribution notices for third party software</a></li>
        </ul>
        <h2>Documents and reports</h2>
        <ul>
          <li><a href="assets/esdoc/index.html">ESDoc</a></li>
          <li><a href="assets/jsdoc/index.html">JSDoc</a></li>
          <li><a href="coverage/lcov-report/index.html">LCOV code coverage</a></li>
          <li><a href="assets/sme.html">Source map explorer</a></li>
        </ul>
      </div>
    );
  }
}
Home.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
  setTitle: React.PropTypes.func,
};
