import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

const LayoutToolbar: React.FC = () => {
  return (
    <AppBar position='static' color='primary'>
      <Toolbar>
        <Typography variant='h4'>WEBSVF</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default LayoutToolbar;
