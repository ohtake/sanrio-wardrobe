import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import * as Colors from 'material-ui/styles/colors';

// See https://github.com/callemall/material-ui/tree/master/src/styles for theme definition
export const themeLight = getMuiTheme({
  palette: {
    primary1Color: Colors.indigo500,
    primary2Color: Colors.indigo700,
    pickerHeaderColor: Colors.indigo500,
  },
});
export const themeDark = getMuiTheme(darkBaseTheme, {
  palette: {
    primary1Color: Colors.indigo500,
    primary2Color: Colors.indigo300,
    accent2Color: Colors.grey700,
    pickerHeaderColor: Colors.indigo500,
  },
  appBar: {
    textColor: Colors.fullWhite,
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

export function getInitialTheme() {
  const h = new Date().getHours();
  const isDaytime = h >= 6 && h < 18;
  return isDaytime ? themeLight : themeDark;
}
