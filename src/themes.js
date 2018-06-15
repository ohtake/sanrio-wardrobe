import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { createMuiTheme } from '@material-ui/core/styles';
import * as Colors from '@material-ui/core/colors';

export const themeDark = getMuiTheme(darkBaseTheme, {
  palette: {
    primary1Color: Colors.indigo['500'],
    primary2Color: Colors.indigo['300'],
    accent2Color: Colors.grey['700'],
    pickerHeaderColor: Colors.indigo['500'],
  },
  appBar: {
    textColor: Colors.common.white,
  },
});

export const themeDarkV1 = createMuiTheme({
  palette: {
    type: 'dark',
    primary: Colors.indigo,
  },
});

let elStyle = null;
export function applyThemeToBody(theme) {
  document.body.style.color = theme.palette.textColor;
  document.body.style.backgroundColor = theme.palette.canvasColor;
  document.body.style.fontFamily = theme.fontFamily;
  if (elStyle != null) {
    document.head.removeChild(elStyle);
  }
  elStyle = document.createElement('style');
  document.head.appendChild(elStyle);
  const stylesheet = elStyle.sheet;
  stylesheet.insertRule(`a { color: ${theme.palette.primary2Color}; }`, stylesheet.cssRules.length);
}
