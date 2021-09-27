import React from 'react';
import { ThemeProvider as MuiThemeProvider, Theme as MuiTheme } from '@material-ui/core/styles';
import { createGlobalStyle, ThemeProvider as StyledThemeProvider, css } from 'styled-components';
import NoSsr from '@material-ui/core/NoSsr';

interface IThemeProviderProps {
  theme: MuiTheme;
}

const globalCss = css`
  *,
  :after,
  :before {
    box-sizing: border-box;
    font-family: Roboto, sans-serif;
  }
`;

const AppStyle = createGlobalStyle`${globalCss}`;

export const ThemeProvider: React.FC<IThemeProviderProps> = ({ children, theme }) => {
  return (
    <NoSsr>
      <MuiThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <AppStyle />
          {children}
        </StyledThemeProvider>
      </MuiThemeProvider>
    </NoSsr>
  );
};
