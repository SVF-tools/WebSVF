import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Shortcuts } from '../multiSession/sessionManager';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 520,
  bgcolor: 'var(--surface)',
  color: 'var(--text-color)',
  border: '1px solid var(--border-color)',
  boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
  borderRadius: 12,
  p: 4,
  zIndex: 10005,
};

export default function ShortcutsModal({
  open,
  handleClose,
  shortcuts,
  setShortcuts,
}: {
  open: boolean;
  handleClose: () => void;
  shortcuts: Shortcuts;
  setShortcuts: (s: Shortcuts) => void;
}) {
  const [local, setLocal] = React.useState<Shortcuts>(shortcuts);

  React.useEffect(() => {
    if (open) {
      setLocal(shortcuts);
    }
  }, [open, shortcuts]);

  const handleChange = (key: string, value: string) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setShortcuts(local);
    localStorage.setItem('websvf-shortcuts', JSON.stringify(local));
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="shortcuts-modal-title"
      aria-describedby="shortcuts-modal-description"
      sx={{
        '& .MuiModal-backdrop': {
          zIndex: 10004,
        },
      }}
      style={{ zIndex: 10005 }}
    >
      <Box sx={style}>
        <Typography
          id="shortcuts-modal-title"
          variant="h6"
          component="h2"
          sx={{ color: 'var(--text-color)' }}
        >
          Keyboard Shortcuts
        </Typography>

        <Typography variant="body2" sx={{ color: 'var(--text-color)', mt: 1, mb: 2 }}>
          Edit the keyboard shortcuts for actions below.
        </Typography>

        <Grid container spacing={2}>
          {Object.entries(local).map(([action, combo]) => (
            <Grid key={action} item xs={12}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={5} sx={{ color: 'var(--text-color)', textTransform: 'capitalize' }}>
                  <Typography variant="subtitle2" sx={{ color: 'var(--text-color)' }}>
                    {action.replace(/_/g, ' ')}
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={combo}
                    onChange={(e) => handleChange(action, e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-color)' },
                      '& .MuiOutlinedInput-input': { color: 'var(--text-color)' },
                    }}
                    inputProps={{ 'aria-label': `Shortcut for ${action}` }}
                  />
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
          <Button
            onClick={handleClose}
            sx={{
              backgroundColor: 'transparent',
              color: 'var(--text-color)',
              textTransform: 'uppercase',
              borderRadius: '10px',
              px: 2.5,
              py: 1,
              border: '1px solid var(--border-color)',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            sx={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-contrast)',
              textTransform: 'uppercase',
              borderRadius: '10px',
              px: 2.5,
              py: 1,
              '&:hover': { backgroundColor: 'var(--primary-hover)' },
            }}
          >
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
