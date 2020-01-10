import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App/App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  PRIMARY_LIGHT_COLOR,
  PRIMARY_DARK_COLOR,
  SECONDARY_DARK_COLOR,
  SECONDARY_LIGHT_COLOR,
} from './App/theme';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
      light: PRIMARY_LIGHT_COLOR,
      dark: PRIMARY_DARK_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
      light: SECONDARY_LIGHT_COLOR,
      dark: SECONDARY_DARK_COLOR,
    },
  },
});

const Root = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
