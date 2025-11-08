import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Save from '@mui/icons-material/Save';
import { getApiKey, setApiKey, clearApiKey, hasUserApiKey } from '../services/openAIService';

const Input = styled(MuiInput)`
  width: 42px;
`;

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'var(--surface)',
  color: 'var(--text-color)',
  border: '1px solid var(--border-color)',
  boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
  borderRadius: 12,
  p: 4,
  zIndex: 10005, // ensure content sits above MUI backdrop
};

export default function SettingsModal({
  open,
  handleClose,
  codeFontSize,
  setCodeFontSize,
  llvmIRFontSize,
  setLLVMIRFontSize,
  terminalOutputFontSize,
  setTerminalOutputFontSize,
}: {
  open: boolean;
  handleClose: () => void;
  codeFontSize: number;
  setCodeFontSize: (codeFontSize: number) => void;
  llvmIRFontSize: number;
  setLLVMIRFontSize: (llvmIRFontSize: number) => void;
  terminalOutputFontSize: number;
  setTerminalOutputFontSize: (terminalOutputFontSize: number) => void;
}) {
  const [apiKey, setApiKeyState] = React.useState('');
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [hasKey, setHasKey] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      const k = getApiKey();
      setApiKeyState(hasUserApiKey() ? k : '');
      setHasKey(!!hasUserApiKey());
      setShowApiKey(false);
    }
  }, [open]);

  const handleCodeSliderChange = (event: Event, newValue: number | number[]) => {
    setCodeFontSize(newValue as number);
  };
  const handleLLVMSliderChange = (event: Event, newValue: number | number[]) => {
    setLLVMIRFontSize(newValue as number);
  };
  const handleTerminalSliderChange = (event: Event, newValue: number | number[]) => {
    setTerminalOutputFontSize(newValue as number);
  };

  const handleCodeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCodeFontSize(event.target.value === '' ? 0 : Number(event.target.value));
  };
  const handleLLVMInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLLVMIRFontSize(event.target.value === '' ? 0 : Number(event.target.value));
  };
  const handleTerminalInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerminalOutputFontSize(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (codeFontSize < 0) {
      setCodeFontSize(10);
    } else if (codeFontSize > 48) {
      setCodeFontSize(48);
    }
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) return;
    setApiKey(apiKey.trim());
    setHasKey(true);
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setApiKeyState('');
    setHasKey(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          '& .MuiModal-backdrop': {
            zIndex: 10004,
          },
        }}
        style={{ zIndex: 10005 }}
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ color: 'var(--text-color)' }}
          >
            Settings
          </Typography>

          {/* Code Editor font size */}
          <Typography id="input-slider" gutterBottom sx={{ color: 'var(--text-color)', mt: 3 }}>
            Code Editor Font Size
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <FormatSizeIcon sx={{ color: 'var(--text-color)' }} />
            </Grid>
            <Grid item xs>
              <Slider
                value={typeof codeFontSize === 'number' ? codeFontSize : 10}
                onChange={handleCodeSliderChange}
                aria-labelledby="input-slider"
                sx={{ color: 'var(--primary)' }}
              />
            </Grid>
            <Grid item>
              <Input
                value={codeFontSize}
                size="small"
                onChange={handleCodeInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: 1,
                  min: 10,
                  max: 48,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
                sx={{ color: 'var(--text-color)' }}
              />
            </Grid>
          </Grid>

          {/* Terminal Output font size */}
          <Typography id="input-slider" gutterBottom sx={{ color: 'var(--text-color)' }}>
            Terminal Output Font Size
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <FormatSizeIcon sx={{ color: 'var(--text-color)' }} />
            </Grid>
            <Grid item xs>
              <Slider
                value={typeof terminalOutputFontSize === 'number' ? terminalOutputFontSize : 10}
                onChange={handleTerminalSliderChange}
                aria-labelledby="input-slider"
                sx={{ color: 'var(--primary)' }}
              />
            </Grid>
            <Grid item>
              <Input
                value={terminalOutputFontSize}
                size="small"
                onChange={handleTerminalInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: 1,
                  min: 10,
                  max: 48,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
                sx={{ color: 'var(--text-color)' }}
              />
            </Grid>
          </Grid>
          {/* LLVMIR Output font size */}
          <Typography id="input-slider" gutterBottom sx={{ color: 'var(--text-color)' }}>
            LLVMIR Font Size
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <FormatSizeIcon sx={{ color: 'var(--text-color)' }} />
            </Grid>
            <Grid item xs>
              <Slider
                value={typeof llvmIRFontSize === 'number' ? llvmIRFontSize : 10}
                onChange={handleLLVMSliderChange}
                aria-labelledby="input-slider"
                sx={{ color: 'var(--primary)' }}
              />
            </Grid>
            <Grid item>
              <Input
                value={llvmIRFontSize}
                size="small"
                onChange={handleLLVMInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: 1,
                  min: 10,
                  max: 48,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
                sx={{ color: 'var(--text-color)' }}
              />
            </Grid>
          </Grid>

          {/* OpenAI API Key */}
          <Typography gutterBottom sx={{ color: 'var(--text-color)', mt: 3 }}>
            OpenAI API Key
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={hasKey ? '••••••••••••••••••••••••••' : 'sk-...'}
            value={apiKey}
            onChange={(e) => setApiKeyState(e.target.value)}
            type={showApiKey ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                    onClick={() => setShowApiKey((s) => !s)}
                    edge="end"
                    sx={{ color: 'var(--text-color)' }}
                  >
                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                  <Tooltip title="Save key">
                    <span>
                      <IconButton
                        aria-label="Save API key"
                        onClick={handleSaveApiKey}
                        edge="end"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          ml: 0.5,
                          '&.Mui-disabled': {
                            color: 'rgba(255, 255, 255, 0.3)',
                          },
                        }}
                        disabled={!apiKey.trim()}
                      >
                        <Save />
                      </IconButton>
                    </span>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputBase-root': {
                color: 'var(--text-color)',
                backgroundColor: 'transparent',
              },
              '& .MuiInputBase-input': {
                color: 'var(--text-color)',
                '::placeholder': { color: 'var(--text-color)', opacity: 0.6 },
              },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-color)' },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--border-color)',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary)',
              },
            }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {hasKey && (
              <Button
                onClick={handleClearApiKey}
                sx={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-color)',
                  textTransform: 'uppercase',
                  borderRadius: '10px',
                  px: 2.5,
                  py: 1,
                  border: '1px solid var(--border-color)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
                }}
              >
                Clear Key
              </Button>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
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
