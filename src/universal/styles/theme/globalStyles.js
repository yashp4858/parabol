import appTheme from 'universal/styles/theme/appTheme';
import makePlaceholderStyles from 'universal/styles/helpers/makePlaceholderStyles';
import tinycolor from 'tinycolor2';
import fontLoader from 'universal/styles/theme/fontLoader';

const basePlaceholderStyles = makePlaceholderStyles(appTheme.palette.dark50l);

export default {
  '*': {
    boxSizing: 'border-box'
  },

  '*::before, *::after': {
    boxSizing: 'border-box'
  },

  html: {
    fontSize: '16px',
    fontFamily: fontLoader
  },

  body: {
    color: appTheme.palette.dark10d,
    fontFamily: appTheme.typography.sansSerif,
    '-moz-osx-font-smoothing': 'grayscale',
    '-webkit-font-smoothing': 'antialiased',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: 'normal',
    margin: 0,
    padding: 0
  },

  a: {
    color: appTheme.palette.cool,
    textDecoration: 'none'
  },

  'a:hover, a:focus': {
    color: tinycolor(appTheme.palette.cool).darken(15).toHexString(),
    textDecoration: 'underline'
  },

  input: {
    fontFamily: appTheme.typography.sansSerif,
    '-moz-osx-font-smoothing': 'grayscale',
    '-webkit-font-smoothing': 'antialiased'
  },

  ...basePlaceholderStyles
};
