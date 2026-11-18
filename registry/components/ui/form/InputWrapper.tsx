import { useId, type ComponentProps, type ReactNode } from 'react';
import type { View } from 'react-native';

import { cn } from '@/components/cn';
import { FormControl as TheFormControl } from '@/components/z/form-control';

import { Error } from '../form/Error';
import { withFrozenProps } from '../primitive';
import type { ErrorItem } from './Error';
import { HelperText } from './HelperText';
import { Label } from './Label';

export type InputWrapperProps = {
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  size?: string | number;
  children?: ReactNode;
  required?: boolean;
  label?: ReactNode;
  containerClassName?: string;
  isFieldDirty?: boolean;
  error?: ErrorItem;
  helperText?: ReactNode;
};

type FormControlRootProps = ComponentProps<typeof View> & {
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  size?: string | number;
};

const FormControlRoot = withFrozenProps<FormControlRootProps, 'size'>(
  TheFormControl,
);

const InputWrapper = (props: InputWrapperProps) => {
  const {
    label,
    containerClassName,
    children,
    isFieldDirty,
    isInvalid,
    isRequired,
    required,
    isDisabled,
    isReadOnly,
    error,
    helperText,
    size,
  } = props;

  const id = useId();

  const hasError = !!error && isFieldDirty;

  const showError = hasError || isInvalid === true;

  return (
    <FormControlRoot
      id={id}
      isInvalid={hasError || isInvalid}
      isRequired={isRequired || required}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      size={size}
      className={cn('grow', containerClassName)}
    >
      {!!label && <Label>{label}</Label>}

      {children}

      {helperText !== undefined && <HelperText>{helperText}</HelperText>}

      {showError && <Error error={error} />}
    </FormControlRoot>
  );
};

export { InputWrapper };
