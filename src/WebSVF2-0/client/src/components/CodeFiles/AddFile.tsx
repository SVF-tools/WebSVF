import { Button, TextField, Dialog, IconButton, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { IUserCode } from '../../models/userCode';

export interface IAddFile {
  open: boolean;
  onDialogOpen: () => void;
  onDialogClose: () => void;
  onCreateFile: () => void;
  fileName: string;
  onFileNameTextFieldChange: (e: any) => void;
  folderName?: string;
  userCodes: IUserCode[];
}

const AddFile: React.FC<IAddFile> = ({ open, onDialogOpen, onDialogClose, onCreateFile, fileName, onFileNameTextFieldChange, folderName, userCodes }) => {
  return (
    <div>
      <IconButton color='primary' onClick={onDialogOpen}>
        <AddIcon />
      </IconButton>
      <Dialog open={open} onClose={onDialogClose}>
        <DialogTitle>Create a New File</DialogTitle>
        <DialogContent>
          <TextField label='File Name' onChange={onFileNameTextFieldChange} value={fileName} />
          <p>{fileName}</p>
          <InputLabel id='select-folder'>Folder</InputLabel>
          <Select labelId='select-folder' id='select-folder' value={folderName} onChange={() => {}} input={<Input />}>
            {userCodes.map((value, id) => {
              return (
                <MenuItem key={id} value={value.folderName}>
                  {value.folderName}
                </MenuItem>
              );
            })}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDialogClose}>Cancel</Button>
          <Button onClick={onCreateFile}>Create File</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddFile;
