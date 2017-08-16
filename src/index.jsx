import React from 'react';
import ReactDOM from 'react-dom';
import HashRouter from 'react-router-dom/HashRouter';
import Route from 'react-router-dom/Route';

import objectFitImages from 'object-fit-images';

import App from './App';

// objectFit does not work on IE and Edge http://caniuse.com/#search=object-fit
objectFitImages();

ReactDOM.render((
  // eslint-disable-next-line react/no-children-prop
  <HashRouter>
    <Route component={App} />
  </HashRouter>
), document.getElementById('app'));
