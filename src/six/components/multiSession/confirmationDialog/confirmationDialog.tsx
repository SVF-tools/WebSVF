import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          bgcolor: 'var(--surface)',
          color: 'var(--text-color)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" sx={{ color: 'var(--text-color)' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ color: 'var(--text-color)' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onCancel}
          sx={{
            bgcolor: 'var(--muted)',
            color: 'var(--text-color)',
            textTransform: 'uppercase',
            borderRadius: '10px',
            px: 2.5,
            '&:hover': { bgcolor: 'var(--muted)' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          autoFocus
          sx={{
            bgcolor: 'var(--danger)',
            color: '#ffffff',
            textTransform: 'uppercase',
            borderRadius: '10px',
            px: 2.5,
            '&:hover': { bgcolor: 'var(--danger-hover)' },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
