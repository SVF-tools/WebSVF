import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import styled from 'styled-components';
import { IThemeProps } from '../../themes/theme';
import { ProjectsTreeView } from './ProjectsTreeView';

const StyledDrawer = styled(Drawer)`
  && {
    & > div {
      white-space: nowrap;
      position: relative;
      width: ${({ theme }: IThemeProps) => theme.spacing(30)}px;
      transition: ${({ theme }: IThemeProps) =>
        theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        })};
    }

    position: relative;
    white-space: nowrap;
    width: ${({ theme }: IThemeProps) => theme.spacing(30)}px;
    margin-top: ${({ theme }: IThemeProps) => theme.spacing(2)}px;
  }
`;

export const LayoutDrawer: React.FC = () => {
  return (
    <StyledDrawer variant='permanent' open>
      <ProjectsTreeView />
    </StyledDrawer>
  );
};
