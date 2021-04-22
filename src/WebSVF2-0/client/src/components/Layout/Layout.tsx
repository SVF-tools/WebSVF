import React from 'react';
import ThemeProvider from '@material-ui/core/styles/ThemeProvider';
import defaultThemeFactory from '../../themes/defaultTheme';
import LayoutToolbar from './LayoutToolbar';

const defaultTheme = defaultThemeFactory();

const Layout: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <LayoutToolbar />
      {children}
    </ThemeProvider>
  );
};

export default Layout;
