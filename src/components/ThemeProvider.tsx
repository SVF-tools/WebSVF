import React from 'react';
import { ThemeProvider as MuiThemeProvider, Theme as MuiTheme } from '@material-ui/core/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import NoSsr from '@material-ui/core/NoSsr';

interface IThemeProviderProps {
  theme: MuiTheme;
}

export const ThemeProvider: React.FC<IThemeProviderProps> = ({ children, theme }) => {
  return (
    <NoSsr>
      <MuiThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
      </MuiThemeProvider>
    </NoSsr>
  );
};
