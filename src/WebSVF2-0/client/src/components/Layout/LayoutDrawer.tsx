import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import styled from 'styled-components';
import { IThemeProps } from '../../themes/theme';

const StyledDrawer = styled(Drawer)`
  && {
    position: relative;
    white-space: nowrap;
    width: ${({ theme }: IThemeProps) => theme.spacing(30)};
  }
`;

const LayoutDrawer: React.FC = () => {
  return (
    <StyledDrawer variant='permanent' open>
      test
      <Divider />
    </StyledDrawer>
  );
};

export default LayoutDrawer;
