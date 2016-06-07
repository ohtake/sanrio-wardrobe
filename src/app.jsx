import React from 'react';
import ReactDOM from 'react-dom';

/* eslint-disable no-console */
if (window.React === undefined) {
  console.warn('No React instance in global var. It won\'t work in production mode since React is in externals.');
} else if (React !== window.React) {
  console.info('Two React instances are loaded. No problem in development mode, as instance in global var will not be used.)');
  console.debug(`React version used: ${React.version}`);
  console.debug(`React version in global var: ${window.React.version}`);
  if (React.version !== window.React.version) {
    console.warn('React versions mismatch. Check package.json and index.html.');
  }
} else {
  // Only one React instance is loaded in global var. It might be in production mode.
}
/* eslint-enable */

import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';

import Home from './home.jsx';
import Character from './character.jsx';
import * as utils from './utils.js';

class App extends React.Component {
  componentDidMount() {
  }
  render() {
    return (
      <div>
        <h1><Link to="/">Sanrio Wardrobe</Link></h1>
        {this.props.children}
      </div>
    );
  }
}
App.propTypes = utils.propTypesRoute;

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="chara/:chara(/:title)" component={Character} />
    </Route>
  </Router>
), document.getElementById('app'));
