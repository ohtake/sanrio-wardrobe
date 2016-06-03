import React from 'react';
// import ReactDOM from 'react-dom';
// import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import CharacterSelector from './character_selector.jsx';

const software = [
  {
    name: 'React Router',
    url: 'https://github.com/reactjs/react-router',
    author: 'React Community',
    author_url: 'https://reactcommunity.org/',
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
    name: 'React Image Lightbox',
    url: 'https://fritz-c.github.io/react-image-lightbox/',
    author: 'Chris Fritz',
    author_url: 'https://github.com/fritz-c',
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
    name: 'Material UI',
    url: 'https://github.com/callemall/material-ui',
    author: 'Call-Em-All',
    author_url: 'https://github.com/callemall',
    license: 'The MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
  },
  {
    name: 'Material icons',
    url: 'https://design.google.com/icons/',
    author: 'Google',
    author_url: 'https://www.google.com/',
    license: 'CC BY 4.0',
    license_url: 'https://creativecommons.org/licenses/by/4.0/',
  },
];

export default class Home extends React.Component {
  componentDidUpdate() {
    // nop
  }
  render() {
    return (
      <div>
        <p>You can find clothings of Sanrio characters.</p>
        <h2>Characters</h2>
        <CharacterSelector mode="large" />
        <h2>Trademarks</h2>
        <p>Sanrio characters are registered trademarks of <a href="https://www.sanrio.co.jp/">Sanrio Co., Ltd.</a></p>
        <h2>Bundled open source software</h2>
        <ul>
          {software.map(s => (
            <li>
              <a href={s.url}>{s.name}</a> made by <a href={s.author_url}>{s.author}</a> is licensed by <a href={s.license_url}>{s.license}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
