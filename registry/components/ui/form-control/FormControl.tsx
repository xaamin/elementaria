import { useState } from 'react';

import { InputIcon, InputSlot } from '@/components/z/input';

import { accessibleName } from '../accessibility';
import { Form, Textarea } from '../form';
import type {
  CheckboxProps,
  FileInputProps,
  InputTextProps,
  InputWrapperProps,
  RadioProps,
  SelectProps,
  TextareaProps,
} from '../form';
import { FileInput } from '../form/FileInput';
import { InputField } from '../form/Input';
import { InputRoot } from '../form/InputRoot';
import { InputWrapper } from '../form/InputWrapper';
import { EyeIcon, EyeOffIcon } from '../icon';

export type FormControlProps = InputWrapperProps & {
  inputClassName?: string;
} & (
    | InputTextProps
    | (Omit<SelectProps, 'type'> & { type: 'select' })
    | (Omit<CheckboxProps, 'type'> & { type: 'checkbox' })
    | (Omit<RadioProps, 'type'> & { type: 'radio' })
    | (Omit<TextareaProps, 'type'> & { type: 'textarea' })
    | (Omit<FileInputProps, 'type' | 'size'> & { type: 'file'; size?: number })
  );

const FormControl = (props: FormControlProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const hasError = !!props.error && props.isFieldDirty;

  if (props.type === 'select') {
    const { type, inputClassName, containerClassName, ...rest } = props;

    return (
      <Form.Select
        {...rest}
        isInvalid={hasError || props.isInvalid}
      />
    );
  }

  if (props.type === 'checkbox') {
    const { type, inputClassName, containerClassName, ...rest } = props;

    return (
      <Form.Checkbox
        {...rest}
        isInvalid={hasError || props.isInvalid}
      />
    );
  }

  if (props.type === 'radio') {
    const { type, inputClassName, containerClassName, ...rest } = props;

    return (
      <Form.Radio
        {...rest}
        isInvalid={hasError || props.isInvalid}
      />
    );
  }

  if (props.type === 'textarea') {
    const { type, inputClassName, containerClassName, ...rest } = props;

    return (
      <Textarea
        {...rest}
        isInvalid={hasError || props.isInvalid}
      />
    );
  }

  if (props.type === 'file') {
    const { type, inputClassName, ...rest } = props;

    return (
      <FileInput
        {...rest}
        isInvalid={hasError || props.isInvalid}
      />
    );
  }

  const { type, inputClassName, containerClassName, ...rest } = props;

  const {
    label,
    error,
    value,
    size,
    children,
    isInvalid,
    isFieldDirty,
    isRequired,
    isDisabled,
    isReadOnly,
    disabled,
    readonly,
  } = rest;

  let newTyoe = type ?? 'text';

  if (type === 'password') {
    if (showPassword) {
      newTyoe = 'text';
    }
  }

  const togglePasswordShow = () => {
    setShowPassword((value) => !value);
  };

  return (
    <InputWrapper
      label={label}
      error={error}
      isInvalid={isInvalid}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly || readonly}
      size={size}
      containerClassName={containerClassName}
      isFieldDirty={isFieldDirty}
    >
      <InputRoot
        className={inputClassName}
        isDisabled={isDisabled || disabled}
        isReadOnly={isReadOnly || readonly}
      >
        <InputField
          {...rest}
          children={undefined}
          aria-label={accessibleName(rest, label)}
          type={newTyoe}
          value={value === undefined ? '' : value}
        />
        {children}
        {type === 'password' && (
          <InputSlot
            onPress={togglePasswordShow}
            className="pr-3"
            accessibilityRole="button"
            accessibilityElementsHidden={false}
            tabIndex={0}
            accessibilityLabel={
              showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
            }
          >
            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
          </InputSlot>
        )}
      </InputRoot>
    </InputWrapper>
  );
};

export { FormControl };
