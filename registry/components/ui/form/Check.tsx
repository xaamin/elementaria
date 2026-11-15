import { Checkbox } from './Checkbox';
import type { CheckboxProps } from './Checkbox';
import { Radio } from './Radio';
import type { RadioProps } from './Radio';

export type CheckProps =
  (RadioProps & { type: 'radio' }) | (CheckboxProps & { type?: 'checkbox' });

const Check = (props: CheckProps) => {
  if (props.type === 'radio') {
    const { type, ...rest } = props;

    return <Radio {...rest} />;
  }

  const { type, ...rest } = props;

  return <Checkbox {...rest} />;
};

export { Check };
