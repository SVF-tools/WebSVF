import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './shareLZSettingsModal.css';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const style = {
  position: 'absolute' as const,
  top: '18%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '84%',
  bgcolor: 'var(--surface)',
  color: 'var(--text-color)',
  border: '1px solid var(--border-color)',
  boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
  borderRadius: 12,
  p: 4,
};

export default function ShareLZSettingsModal({
  open,
  handleClose,
  shareLink,
}: {
  open: boolean;
  handleClose: () => void;
  shareLink: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      /* noop */
    });

    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ color: 'var(--text-color)' }}
          >
            Share
          </Typography>
          <div id="share-container">
            <textarea id="share-textArea" readOnly value={shareLink} />
            <div id="copy-icon-container">
              <ContentCopyIcon onClick={handleCopy} />
            </div>
          </div>
          {showTooltip && <div className="tooltip">Link copied to clipboard</div>}

          <div className="actions-row">
            <Button
              onClick={handleClose}
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
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
