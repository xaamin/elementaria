import { InputField } from './Input';
import type { InputFieldProps } from './Input';
import { InputRoot } from './InputRoot';
import { Select } from './Select';
import type { SelectProps } from './Select';
import { Textarea } from './Textarea';
import type { TextareaProps } from './Textarea';

type ControlInputProps = InputFieldProps & {
  disabled?: boolean;
  readonly?: boolean;
  isInvalid?: boolean;
};

export type ControlProps = {
  variant?: string | number;
} & (
  | (SelectProps & { as: 'select' })
  | (TextareaProps & { as: 'textarea' })
  | (ControlInputProps & { as?: 'input' })
);

const Control = (props: ControlProps) => {
  if (props.as === 'select') {
    const { as, variant, ...rest } = props;

    return <Select {...rest} />;
  }

  if (props.as === 'textarea') {
    const { as, variant, ...rest } = props;

    return <Textarea {...rest} />;
  }

  const { as, variant = 'outline', ...rest } = props;
  const { disabled, readonly, isInvalid } = props;

  return (
    <InputRoot
      variant={variant}
      isDisabled={disabled}
      isInvalid={isInvalid}
      isReadOnly={readonly}
    >
      <InputField {...rest} />
    </InputRoot>
  );
};

export { Control };
