import React, { useEffect } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import styled from 'styled-components';
import { IThemeProps } from '../../themes/theme';
import { useDispatch, useSelector } from 'react-redux';
import { IStore } from '../../store/store';
import { fetchProjects } from '../../store/actionts';

const StyledDrawer = styled(Drawer)`
  && {
    & > div {
      white-space: nowrap;
      position: relative;
      width: ${({ theme }: IThemeProps) => theme.spacing(30)};
      transition: ${({ theme }: IThemeProps) =>
        theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        })};
    }

    position: relative;
    white-space: nowrap;
    width: ${({ theme }: IThemeProps) => theme.spacing(30)};
  }
`;

const LayoutDrawer: React.FC = () => {
  const projects = useSelector((store: IStore) => store.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!projects) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects]);

  return (
    <StyledDrawer variant='permanent' open>
      {projects?.map((x) => x.name).join(' ')}
      <Divider />
    </StyledDrawer>
  );
};

export default LayoutDrawer;
