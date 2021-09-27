import React from 'react';
import { LayoutToolbar } from './LayoutToolbar';
import { LayoutDrawer } from './LayoutDrawer';
import styled from 'styled-components';

const StyledLayout = styled.div`
  display: flex;
`;

const Main = styled.main`
  flex-grow: 1 !important;
  height: 100vh !important;
  overflow: auto !important;
`;

export const Layout: React.FC = ({ children }) => {
  return (
    <StyledLayout>
      <LayoutDrawer />
      <Main>
        <LayoutToolbar />
        {children}
      </Main>
    </StyledLayout>
  );
};
