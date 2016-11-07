import test from 'ava';

import * as themes from '../src/themes';

test.after(() => {
  themes.setTimeProviderForTest(null);
});

/** @test {getInitialTheme} */
test('themes.getInitialTheme should return theme', t => {
  const theme = themes.getInitialTheme();
  t.not(theme.palette, null);
});

/** @test {getInitialTheme} */
test('themes.getInitialTheme should return theme based on time', t => {
  const dataset = [
    { time: new Date(2000, 1, 1, 0, 1), theme: themes.themeDark },
    { time: new Date(2000, 1, 1, 5, 1), theme: themes.themeDark },
    { time: new Date(2000, 1, 1, 6, 1), theme: themes.themeLight },
    { time: new Date(2000, 1, 1, 17, 1), theme: themes.themeLight },
    { time: new Date(2000, 1, 1, 18, 1), theme: themes.themeDark },
    { time: new Date(2000, 1, 1, 23, 1), theme: themes.themeDark },
  ];
  dataset.forEach(d => {
    themes.setTimeProviderForTest(() => d.time);
    const actual = themes.getInitialTheme();
    t.is(actual, d.theme);
  });
});
