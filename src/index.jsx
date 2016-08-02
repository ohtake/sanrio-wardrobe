import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';

import injectTapEventPlugin from 'react-tap-event-plugin';
import objectFitImages from 'object-fit-images';

import App from './App.jsx';
import Home from './Home.jsx';
import Character from './Character.jsx';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// objectFit does not work on IE and Edge http://caniuse.com/#search=object-fit
objectFitImages();

ReactDOM.render((
  <Router history={useRouterHistory(createHashHistory)({ queryKey: false })}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="chara/:chara(/:title)" component={Character} />
    </Route>
  </Router>
), document.getElementById('app'));
