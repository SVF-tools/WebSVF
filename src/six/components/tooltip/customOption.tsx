import { components, OptionProps, GroupBase } from 'react-select';
import Tooltip from './tooltip';

interface CustomOption {
  value: string;
  label: string;
  description?: string;
}

interface CustomSelectProps {
  setPassedPrompt?: (prompt: string) => void;
  name?: string;
}

const CustomOption = (
  props: OptionProps<CustomOption, true, GroupBase<CustomOption>> & {
    selectProps: CustomSelectProps;
  }
) => {
  const { data, selectProps } = props;
  const setPassedPrompt = selectProps?.setPassedPrompt;
  const name = selectProps?.name;

  const optionType = name === 'compileOptions' ? 'compiler flag' : 'executable option';

  return (
    <components.Option {...props}>
      {data.description ? (
        <Tooltip
          content={data.description}
          optionValue={data.value}
          optionType={optionType}
          setPassedPrompt={setPassedPrompt}
        >
          {data.label}
        </Tooltip>
      ) : (
        data.label
      )}
    </components.Option>
  );
};

export default CustomOption;
