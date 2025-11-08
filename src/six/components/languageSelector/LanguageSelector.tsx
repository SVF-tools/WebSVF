import React, { useState } from 'react';
import Select, { StylesConfig, GroupBase } from 'react-select';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface LanguageOption {
  value: string;
  label: string;
}

const options: LanguageOption[] = [
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
];

const customStyles: StylesConfig<LanguageOption, false, GroupBase<LanguageOption>> = {
  control: (provided, state) => ({
    ...provided,
    minHeight: 28,
    height: 28,
    padding: '0 6px',
    backgroundColor: 'var(--surface)',
    borderColor: state.isFocused ? 'var(--primary)' : 'var(--border-color)',
    boxShadow: 'none',
    ':hover': { borderColor: 'var(--primary)' },
    fontSize: '0.875rem',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 6px',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: 28,
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--text-color)',
    margin: 0,
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'var(--surface)',
    color: 'var(--text-color)',
    border: '1px solid var(--border-color)',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'var(--primary)'
      : state.isFocused
      ? 'var(--muted)'
      : 'var(--surface)',
    color: state.isSelected ? 'var(--primary-contrast)' : 'var(--text-color)',
  }),
};

const modalStyle = {
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

const LanguageSelector = ({
  lang,
  setLang,
  onSwitchToDefaultCode,
}: {
  lang: string;
  setLang: (lang: string) => void;
  onSwitchToDefaultCode?: (newLang: string) => void;
}) => {
  const value = options.find((o) => o.value === lang) || options[0];
  const [showModal, setShowModal] = useState(false);
  const [pendingLang, setPendingLang] = useState<string | null>(null);

  const handleLanguageChange = (newLang: string) => {
    if (newLang === lang) return;
    setPendingLang(newLang);
    setShowModal(true);
  };

  const handleConfirmSwitch = () => {
    if (pendingLang) {
      setLang(pendingLang);
      if (onSwitchToDefaultCode) {
        onSwitchToDefaultCode(pendingLang);
      }
    }
    setShowModal(false);
    setPendingLang(null);
  };

  const handleKeepCode = () => {
    if (pendingLang) {
      setLang(pendingLang);
    }
    setShowModal(false);
    setPendingLang(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setPendingLang(null);
  };

  const pendingLabel = options.find((o) => o.value === pendingLang)?.label || '';

  return (
    <>
      <div className="language-selector-small" title="Select language" style={{ minWidth: 72 }}>
        <Select<LanguageOption, false>
          styles={customStyles}
          options={options}
          value={value}
          onChange={(selected) => {
            if (selected) handleLanguageChange(selected.value);
          }}
          isSearchable={false}
          isClearable={false}
          menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
          menuPosition="fixed"
          classNamePrefix="react-select"
        />
      </div>

      <Modal
        open={showModal}
        onClose={handleCancel}
        aria-labelledby="language-switch-modal-title"
        aria-describedby="language-switch-modal-description"
        sx={{ '& .MuiModal-backdrop': { zIndex: 10004 } }}
      >
        <Box sx={modalStyle}>
          <Typography
            id="language-switch-modal-title"
            variant="h6"
            component="h2"
            sx={{ color: 'var(--text-color)' }}
          >
            Switch to {pendingLabel} Default Code?
          </Typography>

          <Typography
            id="language-switch-modal-description"
            variant="body2"
            sx={{ color: 'var(--text-color)', mt: 1 }}
          >
            Would you like to load the default {pendingLabel} starter code, or keep your current
            code?
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
            <Button
              onClick={handleCancel}
              variant="outlined"
              sx={{
                color: 'var(--text-color)',
                borderColor: 'var(--border-color)',
                textTransform: 'none !important',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleKeepCode}
              variant="outlined"
              sx={{
                color: 'var(--text-color)',
                borderColor: 'var(--border-color)',
                textTransform: 'none !important',
              }}
            >
              Keep Current Code
            </Button>
            <Button
              onClick={handleConfirmSwitch}
              variant="contained"
              sx={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-contrast)',
                textTransform: 'none !important',
                whiteSpace: 'nowrap',
                '&:hover': { filter: 'brightness(0.95)' },
              }}
            >
              Load Default Code
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default LanguageSelector;
