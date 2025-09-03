// compileOptionsMenu.tsx
import React from 'react';
import Select, {
  components,
  StylesConfig,
  GroupBase,
  type Props as ReactSelectProps,
  type MultiValueRemoveProps as RSMultiValueRemoveProps,
} from 'react-select';
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
// Note: use react-select Props generic instead of ComponentProps<typeof Select>
// so Option type is not inferred as unknown
type SelectPropsWithCustomProps = ReactSelectProps<
  CompileOption,
  true,
  GroupBase<CompileOption>
> & {
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
  type MultiValueRemoveProps = RSMultiValueRemoveProps<
    CompileOption,
    true,
    GroupBase<CompileOption>
  >;

  const NonRemovableMultiValueRemove: React.FC<MultiValueRemoveProps> = (props) => {
    const { data } = props;
    if ((data as CompileOption | undefined)?.value === '-emit-llvm') {
      return null; // Hide the remove (x) for this option
    }
    return <components.MultiValueRemove {...props} />;
  };

  const handleChange = (selected: readonly CompileOption[] | null) => {
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
  const customStyles: StylesConfig<CompileOption, true, GroupBase<CompileOption>> = {
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
      MultiValueRemove: NonRemovableMultiValueRemove,
    },
    styles: customStyles,
    isMulti: true,
    options: optionsWithDescriptions,
    value: selectedCompileOptions,
    onChange: (newValue) => handleChange(newValue as readonly CompileOption[] | null),
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
    isOptionDisabled: (option: CompileOption) => option.value === '-emit-llvm',
  };

  if (setPassedPrompt) {
    selectProps.setPassedPrompt = setPassedPrompt;
  }

  return <Select {...selectProps} />;
};

export default CompileOptionsMenu;
