import React from 'react';
import Select, { StylesConfig, GroupBase } from 'react-select';

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

const LanguageSelector = ({ lang, setLang }: { lang: string; setLang: (lang: string) => void }) => {
  const value = options.find((o) => o.value === lang) || options[0];

  return (
    <div className="language-selector-small" title="Select language" style={{ minWidth: 72 }}>
      <Select<LanguageOption, false>
        styles={customStyles}
        options={options}
        value={value}
        onChange={(selected) => {
          if (selected) setLang(selected.value);
        }}
        isSearchable={false}
        isClearable={false}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
        menuPosition="fixed"
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default LanguageSelector;
