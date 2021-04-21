import React from 'react';

import { Typography, Grid, List, ListItemIcon, ListItemText, ListItem } from '@material-ui/core';

import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import FolderIcon from '@material-ui/icons/Folder';

const FileList = (props) => {
  return (
    <React.Fragment>
      <Grid container spacing={5} style={{ padding: '15px' }}>
        <Grid item xs={12}>
          <Typography variant='h6'>Project: abc</Typography>

          <List>
            {props.userCode.map((value, index) => {
              return (
                <React.Fragment key={index}>
                  <ListItem
                    button
                    // onClick={props.updateSelectedFile}
                    onClick={() => props.updateSelectedFile(value.fileName)}
                    selected={props.selectedFile === value.fileName}>
                    <ListItemIcon style={{ minWidth: '20px' }}>
                      <FolderIcon style={{ fontSize: '17px' }} />
                      <ArrowRightIcon style={{ fontSize: '17px' }} />
                    </ListItemIcon>
                    <ListItemText primary={value.fileName} style={{ margin: '0' }} />
                  </ListItem>
                  <List dense style={{ paddingLeft: '20px' }}>
                    {props.userCode.map((value, index) => {
                      return (
                        <ListItem
                          key={`${index}-${index}`}
                          button
                          // onClick={props.updateSelectedFile}
                          onClick={() => props.updateSelectedFile(value.fileName)}
                          selected={props.selectedFile === value.fileName}>
                          <ListItemIcon style={{ minWidth: '20px' }}>
                            <InsertDriveFileIcon style={{ fontSize: '15px' }} />
                          </ListItemIcon>
                          <ListItemText primary={value.fileName} style={{ margin: '0' }} />
                        </ListItem>
                      );
                    })}
                  </List>
                </React.Fragment>
              );
            })}
          </List>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default FileList;
