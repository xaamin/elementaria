import type { ComponentProps } from 'react';
import type { TextInput, View } from 'react-native';

import {
  TextareaInput as TheTextareaInput,
  Textarea as TheTextareaPrimitive,
} from '@/components/z/textarea';

import { accessibleName } from '../accessibility';
import { withFrozenProps } from '../primitive';
import { InputWrapper } from './InputWrapper';
import type { InputWrapperProps } from './InputWrapper';

type TextareaRootProps = ComponentProps<typeof View> & {
  variant?: string | number;
  size?: string | number;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
};

type TextareaInputProps = ComponentProps<typeof TextInput> & {
  type?: 'text' | 'password';
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  size?: string | number;
};

const TheTextarea = withFrozenProps<TextareaRootProps, 'variant' | 'size'>(
  TheTextareaPrimitive,
);

const TextareaInput = withFrozenProps<TextareaInputProps, 'size'>(
  TheTextareaInput,
);

export type TextareaProps = Omit<
  TextareaInputProps,
  keyof InputWrapperProps | 'style' | 'ref'
> &
  InputWrapperProps & {
    style?: TextareaRootProps['style'] & TextareaInputProps['style'];
    variant?: TextareaRootProps['variant'];
    disabled?: boolean;
    readonly?: boolean;
  };

const Textarea = (props: TextareaProps) => {
  const { label, error, isFieldDirty, disabled, readonly, isInvalid, ...rest } =
    props;

  return (
    <InputWrapper {...props}>
      <TheTextarea
        size="md"
        isReadOnly={readonly}
        isInvalid={isInvalid}
        isDisabled={disabled}
        {...rest}
      >
        <TextareaInput
          {...rest}
          aria-label={accessibleName(rest, label)}
        />
      </TheTextarea>
    </InputWrapper>
  );
};

export { Textarea };
