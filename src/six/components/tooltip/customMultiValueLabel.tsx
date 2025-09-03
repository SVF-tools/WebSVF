import { components, GroupBase, type MultiValueGenericProps } from 'react-select';
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

const CustomMultiValueLabel = (
  props: MultiValueGenericProps<CustomOption, true, GroupBase<CustomOption>>
) => {
  const { data } = props as { data: CustomOption };
  const sp = props.selectProps as typeof props.selectProps & CustomSelectProps;
  const setPassedPrompt = sp?.setPassedPrompt;
  const name = sp?.name;

  const optionType = name === 'compileOptions' ? 'compiler flag' : 'executable option';

  if (!data.description) {
    return <components.MultiValueLabel {...props} />;
  }

  return (
    <Tooltip
      content={data.description}
      optionValue={data.value}
      optionType={optionType}
      setPassedPrompt={setPassedPrompt}
    >
      <div style={{ display: 'inline-block', borderBottom: '1px dotted #777' }}>
        <components.MultiValueLabel {...props} />
      </div>
    </Tooltip>
  );
};

export default CustomMultiValueLabel;
