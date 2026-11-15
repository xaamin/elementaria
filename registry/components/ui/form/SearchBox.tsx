import { SearchIcon, XIcon } from 'lucide-react-native';
import { useState } from 'react';

import { accessibleName } from '../accessibility';
import { InputWrapper } from '../form/InputWrapper';
import { Pressable } from '../pressable';
import { InputField } from './Input';
import type { InputFieldPrimitiveProps } from './Input';
import { InputRoot } from './InputRoot';
import type { InputWrapperProps } from './InputWrapper';

export interface SearchBoxProps
  extends
    Omit<InputFieldPrimitiveProps, keyof InputWrapperProps | 'type'>,
    InputWrapperProps {
  inputClassName?: string;
  containerClassName?: string;
  onSearch: (value: string) => void;
  disabled?: boolean;
  readonly?: boolean;
}

const SearchBox = (props: SearchBoxProps) => {
  const [value, setValue] = useState('');

  const { inputClassName, containerClassName, onSearch, ...rest } = props;

  const {
    label,
    error,
    value: propValue,
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

  const handleKeyPress: NonNullable<SearchBoxProps['onKeyPress']> = (e) => {
    if (e.nativeEvent.key === 'Enter' && !error) {
      onSearch(value);
    }
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
        className={inputClassName}
        isDisabled={isDisabled || disabled}
        isReadOnly={isReadOnly || readonly}
      >
        <InputField
          {...rest}
          children={undefined}
          aria-label={ariaLabel}
          value={value === undefined ? '' : value}
          onKeyPress={handleKeyPress}
          onChangeText={setValue}
        />

        {!value.trim() && (
          <Pressable
            onPress={() => onSearch(value)}
            className="p-3"
            accessibilityRole="button"
            accessibilityLabel="Buscar"
            disabled={isDisabled || disabled}
          >
            <SearchIcon className="text-typography-500" />
          </Pressable>
        )}
        {!!value.trim() && (
          <Pressable
            onPress={() => setValue('')}
            className="p-3"
            accessibilityRole="button"
            accessibilityLabel="Limpiar"
            disabled={isDisabled || disabled}
          >
            <XIcon className="text-typography-500" />
          </Pressable>
        )}
      </InputRoot>
    </InputWrapper>
  );
};

export { SearchBox };
