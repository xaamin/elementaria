import { useState } from 'react';
import type { ComponentProps, ComponentType, Ref } from 'react';
import type { TextInput, TextInputInstance } from 'react-native';

import {
  InputField as PrimitiveInputField,
  InputIcon,
  InputSlot,
} from '@/components/z/input';

import { accessibleName } from '../accessibility';
import { InputWrapper } from '../form/InputWrapper';
import { EyeIcon, EyeOffIcon } from '../icon';
import { FileInput } from './FileInput';
import type { FileInputProps } from './FileInput';
import { InputRoot } from './InputRoot';
import type { InputWrapperProps } from './InputWrapper';

export type InputRef = TextInputInstance;

export type InputFieldPrimitiveProps = ComponentProps<typeof TextInput> & {
  type?: 'text' | 'password';
  onKeyPress?: (e: any) => void;
  onFocus?: any;
  onBlur?: any;
  variant?: string | number;
  size?: string | number;
  className?: string;
};

export interface InputTextProps
  extends
    Omit<InputFieldPrimitiveProps, keyof InputWrapperProps | 'type' | 'ref'>,
    InputWrapperProps {
  type?: 'text' | 'password' | 'number' | 'email' | 'tel' | 'url';
  inputClassName?: string;
  containerClassName?: string;
  disabled?: boolean;
  readonly?: boolean;
  ref?: Ref<InputRef>;
}

export type InputProps = InputTextProps | (FileInputProps & { type: 'file' });

export type InputFieldProps = Omit<InputFieldPrimitiveProps, 'type' | 'ref'> &
  Pick<InputTextProps, 'type' | 'ref'>;

type TextInputDefaults = Pick<
  InputFieldProps,
  'keyboardType' | 'autoCapitalize' | 'autoComplete' | 'autoCorrect'
>;

// React Native ignores `type` and react-native-web derives the DOM `type` and
// `inputmode` from `keyboardType`, so each declared type maps to its keyboard.
const TYPE_DEFAULTS: Partial<Record<string, TextInputDefaults>> = {
  number: { keyboardType: 'numeric' },
  email: {
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    autoComplete: 'email',
    autoCorrect: false,
  },
  tel: { keyboardType: 'phone-pad', autoComplete: 'tel' },
  url: { keyboardType: 'url', autoCapitalize: 'none', autoCorrect: false },
};

// The keyboard of the type yields to the caller's own keyboard or input mode.
function typeDefaults(
  type: InputTextProps['type'],
  props: Pick<InputFieldProps, 'keyboardType' | 'inputMode'>,
) {
  const defaults = TYPE_DEFAULTS[type ?? 'text'];

  if (!defaults) {
    return {};
  }

  if (props.keyboardType !== undefined || props.inputMode !== undefined) {
    return { ...defaults, keyboardType: undefined };
  }

  return defaults;
}

// The primitive forwards these props but restricts their declarations.
const PrimitiveField = PrimitiveInputField as ComponentType<InputFieldProps>;

// The primitive names every field "Input Field" unless it receives an
// aria-label, so an accessibilityLabel from the caller becomes that name.
export const InputField = (props: InputFieldProps) => {
  return (
    <PrimitiveField
      {...props}
      aria-label={accessibleName(props)}
    />
  );
};

const Input = (props: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  if (props.type === 'file') {
    const { type, ...fileProps } = props;

    return <FileInput {...fileProps} />;
  }

  const { type, variant, inputClassName, containerClassName, ...rest } = props;

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

  const ariaLabel = accessibleName(rest, label);

  let newType = type ?? 'text';

  if (type === 'password' && showPassword) {
    newType = 'text';
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
        size={size}
        variant={variant}
        className={inputClassName}
        isDisabled={isDisabled || disabled}
        isReadOnly={isReadOnly || readonly}
      >
        <InputField
          {...typeDefaults(type, rest)}
          {...rest}
          children={undefined}
          aria-label={ariaLabel}
          type={newType}
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

export { Input };
