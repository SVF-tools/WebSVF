import {
  Button,
  TextField,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import React from "react";
import AddIcon from "@material-ui/icons/Add";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";

const AddFile = (props) => {
  return (
    <div>
      <IconButton
        variant='contained'
        color='primary'
        onClick={props.openDialog}
      >
        <AddIcon />
      </IconButton>
      <Dialog open={props.dialogBox} onClose={props.closeDialog}>
        <DialogTitle>Create a New File</DialogTitle>
        <DialogContent>
          <TextField
            label='File Name'
            onChange={props.handleFileName}
            value={props.fileName}
          />
          <p>{props.fileName}</p>
          <InputLabel id='select-folder'>Folder</InputLabel>
          <Select
            labelId='select-folder'
            id='select-folder'
            value={props.folderName}
            onChange={() => {}}
            input={<Input />}
          >
            {props.userCode.map((value, id) => {
              return (
                <MenuItem key={id} value={value.folderName}>
                  {value.folderName}
                </MenuItem>
              );
            })}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeDialog}>Cancel</Button>
          <Button onClick={props.handleAddFile}>Create File</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddFile;
