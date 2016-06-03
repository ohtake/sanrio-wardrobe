import React from 'react';
// import ReactDOM from 'react-dom';
// import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import CharacterSelector from './character_selector.jsx';

export default class Home extends React.Component {
  componentDidUpdate() {
    // nop
  }
  render() {
    return (
      <div>
        <p>You can find clothings of Sanrio characters.</p>
        <h2>Characters</h2>
        <CharacterSelector />
        <h2>Trademarks</h2>
        <p>Sanrio characters are registered trademarks of <a href="https://www.sanrio.co.jp/">Sanrio Co., Ltd.</a></p>
        <h2>Bundled open source software</h2>
        <ul>
          <li><a href="https://github.com/reactjs/react-router">React Router</a> made by <a href="https://reactcommunity.org/">React Community</a> is licensed by <a href="https://opensource.org/licenses/MIT">The MIT License</a></li>
          <li><a href="https://github.com/flickr/justified-layout">Flickr's Justified Layout</a> made by <a href="https://www.yahoo.com/">Yahoo</a> is licensed by <a href="https://opensource.org/licenses/MIT">The MIT License</a></li>
          <li><a href="http://dean177.github.io/react-justified-layout/">react-justified-layout</a> made by <a href="https://github.com/Dean177">Dean Merchant</a> is licensed by <a href="http://www.isc.org/downloads/software-support-policy/isc-license/">ISC license</a></li>
          <li><a href="https://fritz-c.github.io/react-image-lightbox/">React Image Lightbox</a> made by <a href="https://github.com/fritz-c">Chris Fritz</a> is licensed by <a href="https://opensource.org/licenses/MIT">The MIT License</a></li>
          <li><a href="https://github.com/loktar00/react-lazy-load">react-lazy-load</a> made by <a href="https://github.com/loktar00">Jason</a> is licensed by <a href="https://opensource.org/licenses/MIT">The MIT License</a></li>
          <li><a href="https://github.com/callemall/material-ui">Material UI</a> made by <a href="https://github.com/callemall">Call-Em-All</a> is licensed by <a href="https://opensource.org/licenses/MIT">The MIT License</a></li>
          <li><a href="https://design.google.com/icons/">Material icons</a> made by <a href="https://www.google.com/">Google</a> is licensed by <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a></li>
        </ul>
      </div>
    );
  }
}
