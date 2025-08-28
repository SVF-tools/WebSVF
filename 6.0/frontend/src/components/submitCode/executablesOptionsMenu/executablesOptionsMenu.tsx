// executablesOptionsMenu.tsx
import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import CustomOption from '../../tooltip/customOption';
import CustomMultiValueLabel from '../../tooltip/customMultiValueLabel';
import {
  executableOptionDescriptions,
  addDescriptionsToOptions,
} from '../../tooltip/tooltipDescriptions';

const animatedComponents = makeAnimated();

interface executableOption {
  value: string;
  label: string;
  description?: string;
}

interface ExecutableOptionsMenuProps {
  executableOptions: executableOption[];
  setSelectedExecutableOptions: (selectedExecutableOptions: executableOption[]) => void;
  selectedExecutableOptions: executableOption[];
  setPassedPrompt?: (prompt: string) => void;
}

// Create a type to extend React-Select props
type SelectPropsWithCustomProps = React.ComponentProps<typeof Select> & {
  setPassedPrompt?: (prompt: string) => void;
  name?: string;
};

const ExecutableOptionsMenu: React.FC<ExecutableOptionsMenuProps> = ({
  executableOptions,
  setSelectedExecutableOptions,
  selectedExecutableOptions,
  setPassedPrompt,
}) => {
  // Add descriptions to options
  const optionsWithDescriptions = addDescriptionsToOptions(
    executableOptions,
    executableOptionDescriptions
  );

  // Handler for selection changes
  const handleChange = (selected) => {
    setSelectedExecutableOptions(selected || []);
    if (setPassedPrompt) setPassedPrompt('');
  };

  // Custom styles to ensure tooltips are visible and theme-consistent
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      overflow: 'visible',
      backgroundColor: 'var(--surface)',
      color: 'var(--text-color)',
      borderColor: state.isFocused ? 'var(--primary)' : 'var(--border-color)',
      boxShadow: 'none',
      ':hover': {
        borderColor: 'var(--primary)',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      position: 'relative',
      overflow: 'visible',
      backgroundColor: state.isSelected
        ? 'var(--primary)'
        : state.isFocused
          ? 'var(--muted)'
          : 'var(--surface)',
      color: state.isSelected ? 'var(--primary-contrast)' : 'var(--text-color)',
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menu: (provided) => ({
      ...provided,
      overflow: 'visible',
      zIndex: 9999,
      backgroundColor: 'var(--surface)',
      color: 'var(--text-color)',
      border: '1px solid var(--border-color)',
    }),
    menuList: (provided) => ({
      ...provided,
      overflow: 'visible',
      backgroundColor: 'var(--surface)',
      color: 'var(--text-color)',
    }),
    multiValue: (provided) => ({
      ...provided,
      position: 'relative',
      overflow: 'visible',
      backgroundColor: 'var(--muted)',
      color: 'var(--text-color)',
      border: '1px solid var(--border-color)',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'var(--text-color)',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'var(--text-color)',
      ':hover': { backgroundColor: 'var(--danger)', color: 'var(--primary-contrast)' },
    }),
    valueContainer: (provided) => ({
      ...provided,
      overflow: 'visible',
      color: 'var(--text-color)',
    }),
    input: (provided) => ({
      ...provided,
      color: 'var(--text-color)',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'var(--text-color)',
      opacity: 0.8,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--text-color)',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      color: 'var(--text-color)',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'var(--text-color)',
      ':hover': { color: 'var(--text-color)' },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: 'var(--text-color)',
      ':hover': { color: 'var(--danger)' },
    }),
  };

  // Create props that include custom props
  const selectProps: SelectPropsWithCustomProps = {
    closeMenuOnSelect: false,
    components: {
      ...animatedComponents,
      Option: CustomOption,
      MultiValueLabel: CustomMultiValueLabel,
    },
    styles: customStyles,
    isMulti: true,
    options: optionsWithDescriptions,
    value: selectedExecutableOptions,
    onChange: handleChange,
    menuPortalTarget: document.body,
    menuPosition: 'fixed',
    name: 'executableOptions',
    classNamePrefix: 'react-select',
  };

  if (setPassedPrompt) {
    selectProps.setPassedPrompt = setPassedPrompt;
  }

  return <Select {...selectProps} />;
};

export default ExecutableOptionsMenu;
