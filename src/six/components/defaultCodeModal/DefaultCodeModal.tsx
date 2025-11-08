import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { DEFAULT_C_CODE, DEFAULT_CPP_CODE } from '../../pages/graphs/graphsPage';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 480,
  bgcolor: 'var(--surface)',
  color: 'var(--text-color)',
  border: '1px solid var(--border-color)',
  boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
  borderRadius: 12,
  p: 3,
  zIndex: 10005,
};

export default function DefaultCodeModal({
  open,
  handleClose,
  setCode,
  language,
}: {
  open: boolean;
  handleClose: () => void;
  setCode: (code: string) => void;
  language: string;
}) {
  const handleConfirm = () => {
    if (language === 'c') {
      setCode(DEFAULT_C_CODE);
    } else {
      setCode(DEFAULT_CPP_CODE);
    }
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="default-code-modal-title"
      aria-describedby="default-code-modal-description"
      sx={{ '& .MuiModal-backdrop': { zIndex: 10004 } }}
    >
      <Box sx={style}>
        <Typography
          id="default-code-modal-title"
          variant="h6"
          component="h2"
          sx={{ color: 'var(--text-color)' }}
        >
          Reset Editor to Default Code
        </Typography>

        <Typography
          id="default-code-modal-description"
          variant="body2"
          sx={{ color: 'var(--text-color)', mt: 1 }}
        >
          This will replace the current editor contents with the default starter code. This action
          cannot be undone unless you have a saved copy. Are you sure you want to continue?
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              color: 'var(--text-color)',
              borderColor: 'var(--border-color)',
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{
              backgroundColor: 'var(--danger)',
              color: 'var(--primary-contrast)',
              textTransform: 'none',
              '&:hover': { filter: 'brightness(0.95)' },
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
