import React from 'react';
import defaultThemeFactory from '../../themes/defaultTheme';
import LayoutToolbar from './LayoutToolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LayoutDrawer from './LayoutDrawer';
import { ThemeProvider } from '../ThemeProvider';
import styled from 'styled-components';

export const StyledLayout = styled.div`
  display: flex;
`;

export const Main = styled.main`
  flex-grow: 1 !important;
  height: 100vh !important;
  overflow: auto !important;
`;

const defaultTheme = defaultThemeFactory();

const Layout: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <StyledLayout>
        <LayoutDrawer />
        <Main>
          <LayoutToolbar />
          {children}
        </Main>
      </StyledLayout>
    </ThemeProvider>
  );
};

export default Layout;
