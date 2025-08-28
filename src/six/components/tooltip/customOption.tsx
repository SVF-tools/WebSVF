import { components } from 'react-select';
import Tooltip from './tooltip';

const CustomOption = (props: any) => {
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
