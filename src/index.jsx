import React from 'react';
import ReactDOM from 'react-dom';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import Router from 'react-router/lib/Router';
import hashHistory from 'react-router/lib/hashHistory';

import injectTapEventPlugin from 'react-tap-event-plugin';
import objectFitImages from 'object-fit-images';

import App from './App';
import Home from './Home';
import Character from './Character';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// objectFit does not work on IE and Edge http://caniuse.com/#search=object-fit
objectFitImages();

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="chara/:chara(/:title)" component={Character} />
    </Route>
  </Router>
), document.getElementById('app'));
