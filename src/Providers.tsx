import React from 'react';
import defaultThemeFactory from './themes/defaultTheme';
import { ThemeProvider } from './components/ThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter } from 'react-router-dom';

const defaultTheme = defaultThemeFactory();

export const Providers: React.FC = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};
