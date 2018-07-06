import { createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';

export const themeLightV1 = createMuiTheme({
  palette: {
    primary: indigo,
  },
});

export const themeDarkV1 = createMuiTheme({
  palette: {
    type: 'dark',
    primary: indigo,
  },
});

let elStyle = null;
export function applyThemeToBody(theme) {
  document.body.style.color = theme.palette.text.primary;
  document.body.style.backgroundColor = theme.palette.background.default;
  document.body.style.fontFamily = theme.typography.fontFamily;
  if (elStyle != null) {
    document.head.removeChild(elStyle);
  }
  elStyle = document.createElement('style');
  document.head.appendChild(elStyle);
  const stylesheet = elStyle.sheet;
  stylesheet.insertRule(`a { color: ${theme.palette.primary.main}; }`, stylesheet.cssRules.length);
}
