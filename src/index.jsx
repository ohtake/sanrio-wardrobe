import React from 'react';
import ReactDOM from 'react-dom';
import HashRouter from 'react-router-dom/HashRouter';
import Route from 'react-router-dom/Route';

import injectTapEventPlugin from 'react-tap-event-plugin';
import objectFitImages from 'object-fit-images';

import App from './App';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// objectFit does not work on IE and Edge http://caniuse.com/#search=object-fit
objectFitImages();

ReactDOM.render((
  // eslint-disable-next-line react/no-children-prop
  <HashRouter>
    <Route component={App} />
  </HashRouter>
), document.getElementById('app'));
