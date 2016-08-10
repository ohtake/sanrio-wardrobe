import React from 'react';
import Link from 'react-router/lib/Link';

import JustifiedLayout from 'react-justified-layout';
import DataFile from './data_file.js';
import * as utils from './utils.js';

/**
 * @private
 * @const {array.<{name: string, url: string, author: string, author_url: string, license: string, license_url: string}>}
 */
const software = [
  {
    name: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Facebook',
    author_url: 'https://github.com/facebook',
    license: 'The BSD 3-Clause License',
    license_url: 'https://opensource.org/licenses/BSD-3-Clause',
  },
  {
    name: 'React Router',
    url: 'https://github.com/reactjs/react-router',
    author: 'React Community',
    author_url: 'https://reactcommunity.org/',
    license: 'The MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
  },
  {
    name: 'Material UI',
    url: 'https://github.com/callemall/material-ui',
    author: 'Call-Em-All',
    author_url: 'https://github.com/callemall',
    license: 'The MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
  },
  {
    name: 'Flickr\'s Justified Layout',
    url: 'https://github.com/flickr/justified-layout',
    author: 'Yahoo',
    author_url: 'https://www.yahoo.com/',
    license: 'The MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
  },
  {
    name: 'react-justified-layout',
    url: 'http://dean177.github.io/react-justified-layout/',
    author: 'Dean Merchant',
    author_url: 'https://github.com/Dean177',
    license: 'ISC license',
    license_url: 'http://www.isc.org/downloads/software-support-policy/isc-license/',
  },
  {
    name: 'Swipeable',
    url: 'https://github.com/dogfessional/react-swipeable',
    author: 'Dogfessional',
    author_url: 'https://github.com/dogfessional',
    license: 'The MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
  },
  {
    name: 'verge',
    url: 'http://verge.airve.com/',
    author: 'Ryan Van Etten',
    author_url: 'http://ryanve.com/',
    license: 'The MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
  },
  {
    name: 'CSS Element Queries',
    url: 'https://github.com/marcj/css-element-queries',
    author: 'Marc J. Schmidt',
    author_url: 'https://github.com/marcj',
    license: 'The MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
  },
  {
    name: 'object-fit-images',
    url: 'https://github.com/bfred-it/object-fit-images',
    author: 'Federico Brigante',
    author_url: 'https://github.com/bfred-it',
    license: 'The MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
  },
  {
    name: 'react-lazy-load',
    url: 'https://github.com/loktar00/react-lazy-load',
    author: 'Jason',
    author_url: 'https://github.com/loktar00',
    license: 'The MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
  },
  {
    name: 'lodash',
    url: 'https://lodash.com/',
    author: 'jQuery Foundation and other contributors',
    author_url: 'https://jquery.org/',
    license: 'The MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
  },
];

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

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.widthListener = new utils.ContainerClientWidthListener(this, () => this.grid, 'containerWidth');
  }
  componentDidMount() {
    this.widthListener.componentDidMount();
  }
  componentDidUpdate(prevProps, prevState) {
    this.widthListener.componentDidUpdate(prevProps, prevState);
  }
  componentWillUnmount() {
    this.widthListener.componentWillUnmount();
  }
  /**
   * @private
   * @param {DataFile} c
   * @returns {React.Node}
   */
  renderTile(c) {
    return (
      <Link key={c.name} to={`/chara/${c.name}`} aspectRatio={1} data-ga-on="click" data-ga-event-category="chara" data-ga-event-action="homeTile" data-ga-event-label={c.name}>
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
        <div ref={c => { this.grid = c; }}>
          <JustifiedLayout targetRowHeight={150} containerPadding={0} boxSpacing={6} containerWidth={this.state.containerWidth}>
            {DataFile.all.map(c => this.renderTile(c))}
          </JustifiedLayout>
        </div>
        <h2>Trademarks</h2>
        <p>Sanrio characters are registered trademarks of <a href="https://www.sanrio.co.jp/">Sanrio Co., Ltd.</a></p>
        <h2>Bundled open source software</h2>
        <ul>
          {software.map(s => (
            <li key={s.name}>
              <a href={s.url}>{s.name}</a> made by <a href={s.author_url}>{s.author}</a> is licensed by <a href={s.license_url}>{s.license}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
Home.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};
