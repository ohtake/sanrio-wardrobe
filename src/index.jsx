import React from 'react';
import ReactDOM from 'react-dom';
import HashRouter from 'react-router-dom/HashRouter';
import Route from 'react-router-dom/Route';
import { MuiThemeProvider } from '@material-ui/core/styles';

import objectFitImages from 'object-fit-images';

import App from './App';
import * as themes from './themes';

// objectFit does not work on IE and Edge http://caniuse.com/#search=object-fit
objectFitImages();

ReactDOM.render(<MuiThemeProvider theme={themes.themeDarkV1}><HashRouter><Route component={App} /></HashRouter></MuiThemeProvider>, document.getElementById('app'));
