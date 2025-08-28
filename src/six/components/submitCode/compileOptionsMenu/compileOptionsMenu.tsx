// compileOptionsMenu.tsx
import React from 'react';
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import CustomOption from '../../tooltip/customOption';
import CustomMultiValueLabel from '../../tooltip/customMultiValueLabel';
import {
  compileOptionDescriptions,
  addDescriptionsToOptions,
} from '../../tooltip/tooltipDescriptions';

const animatedComponents = makeAnimated();

interface CompileOption {
  value: string;
  label: string;
  description?: string;
}

interface CompileOptionsMenuProps {
  compileOptions: CompileOption[];
  setSelectedCompileOptions: (selectedCompileOptions: CompileOption[]) => void;
  selectedCompileOptions: CompileOption[];
  setPassedPrompt?: (prompt: string) => void;
}

// Create a type to extend React-Select props
type SelectPropsWithCustomProps = React.ComponentProps<typeof Select> & {
  setPassedPrompt?: (prompt: string) => void;
  name?: string;
};

const CompileOptionsMenu: React.FC<CompileOptionsMenuProps> = ({
  compileOptions,
  setSelectedCompileOptions,
  selectedCompileOptions,
  setPassedPrompt,
}) => {
  const optionsWithDescriptions = addDescriptionsToOptions(
    compileOptions,
    compileOptionDescriptions
  );

  // Non-removable chip for -emit-llvm
  type MultiValueRemoveProps = React.ComponentProps<typeof components.MultiValueRemove> & {
    data?: { value?: string };
  };

  const NonRemovableMultiValueRemove: React.FC<MultiValueRemoveProps> = (props) => {
    const { data } = props;
    if (data?.value === '-emit-llvm') {
      return null; // Hide the remove (x) for this option
    }
    return <components.MultiValueRemove {...props} />;
  };

  const handleChange = (selected: any) => {
    const next = Array.isArray(selected) ? [...selected] : [];
    // Ensure -emit-llvm is always present
    const mustKeep = optionsWithDescriptions.find((o) => o.value === '-emit-llvm');
    if (mustKeep && !next.some((o) => o.value === mustKeep.value)) {
      next.push(mustKeep);
    }
    setSelectedCompileOptions(next);
    if (setPassedPrompt) setPassedPrompt('');
  };

  // Custom styles to ensure tooltips are visible and theme-consistent
  const customStyles = {
    control: (provided: any, state: any) => ({
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
    option: (provided: any, state: any) => ({
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
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
    menu: (provided: any) => ({
      ...provided,
      overflow: 'visible',
      zIndex: 9999,
      backgroundColor: 'var(--surface)',
      color: 'var(--text-color)',
      border: '1px solid var(--border-color)',
    }),
    menuList: (provided: any) => ({
      ...provided,
      overflow: 'visible',
      backgroundColor: 'var(--surface)',
      color: 'var(--text-color)',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      position: 'relative',
      overflow: 'visible',
      backgroundColor: 'var(--muted)',
      color: 'var(--text-color)',
      border: '1px solid var(--border-color)',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: 'var(--text-color)',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: 'var(--text-color)',
      ':hover': { backgroundColor: 'var(--danger)', color: 'var(--primary-contrast)' },
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      overflow: 'visible',
      color: 'var(--text-color)',
    }),
    input: (provided: any) => ({
      ...provided,
      color: 'var(--text-color)',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'var(--text-color)',
      opacity: 0.8,
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'var(--text-color)',
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      color: 'var(--text-color)',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: 'var(--text-color)',
      ':hover': { color: 'var(--text-color)' },
    }),
    clearIndicator: (provided: any) => ({
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
      MultiValueRemove: NonRemovableMultiValueRemove,
    },
    styles: customStyles,
    isMulti: true,
    options: optionsWithDescriptions,
    value: selectedCompileOptions,
    onChange: handleChange,
    menuPortalTarget: document.body,
    menuPosition: 'fixed',
    defaultValue: [
      optionsWithDescriptions[0],
      optionsWithDescriptions[1],
      optionsWithDescriptions[2],
      optionsWithDescriptions[3],
      optionsWithDescriptions[4],
    ],
    name: 'compileOptions',
    classNamePrefix: 'react-select',
    // Prevent toggling -emit-llvm from the menu
    isOptionDisabled: (option: unknown) => (option as CompileOption)?.value === '-emit-llvm',
  };

  if (setPassedPrompt) {
    selectProps.setPassedPrompt = setPassedPrompt;
  }

  return <Select {...selectProps} />;
};

export default CompileOptionsMenu;
