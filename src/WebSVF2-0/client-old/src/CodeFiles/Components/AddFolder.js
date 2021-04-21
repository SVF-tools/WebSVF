import React from "react";
import {
  Button,
  TextField,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";

const AddFolder = (props) => {
  return (
    <div>
      <IconButton
        variant="contained"
        color="primary"
        onClick={props.openDialog}
      >
        <CreateNewFolderIcon />
      </IconButton>
      <Dialog open={props.dialogBox} onClose={props.closeDialog}>
        <DialogTitle>Create new folder</DialogTitle>
        <DialogContent>
          <TextField label="Folder Name" onChange={props.handleFolderName} />
          <p>{props.folderName}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeDialog}>Cancel</Button>
          <Button onClick={props.handleAddFolder}>Create Folder</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddFolder;
