import { useEffect, useId, useRef } from 'react';
import type { ComponentProps } from 'react';
import { Platform } from 'react-native';
import type { Pressable, View } from 'react-native';

import { ChevronDownIcon } from '@/components/z/icon';
import {
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger as TheSelectTrigger,
  Select as TheSelectPrimitive,
} from '@/components/z/select';

import { accessibleName } from '../accessibility';
import { withFrozenProps } from '../primitive';
import { InputWrapper } from './InputWrapper';
import type { InputWrapperProps } from './InputWrapper';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type SelectPrimitiveProps = ComponentProps<typeof View> & {
  selectedValue?: string | null;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  isHovered?: boolean;
  isFocused?: boolean;
  isFocusVisible?: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  placeholder?: string;
  onOpen?: () => void;
  selectedLabel?: string;
  initialLabel?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  size?: string | number;
};

type SelectTriggerProps = ComponentProps<typeof Pressable> & {
  variant?: string | number;
  size?: string | number;
};

const SelectTrigger = withFrozenProps<SelectTriggerProps, 'variant' | 'size'>(
  TheSelectTrigger,
);

const TheSelect = withFrozenProps<SelectPrimitiveProps, 'size'>(
  TheSelectPrimitive,
);

export type SelectProps = Omit<
  SelectPrimitiveProps,
  keyof InputWrapperProps | 'selectedValue' | 'onValueChange'
> &
  InputWrapperProps & {
    value?: string;
    options?: SelectOption[];
    placeholder?: string;
    onChange?: (value: string) => void;
    onValueChange?: (value: string) => void;
  };

const noOpFn = () => {};

const Select = (props: SelectProps) => {
  const {
    value,
    options = [],
    placeholder,
    onChange,
    onValueChange,
    label,
    containerClassName,
    children,
    isFieldDirty,
    isInvalid,
    isRequired,
    isDisabled,
    isReadOnly,
    error,
    size,
    ...remaining
  } = props;
  const selectedItem = options.find((item) => item.value === value);
  const ariaLabel = accessibleName(
    remaining,
    typeof label === 'string' ? label : placeholder,
  );

  const triggerId = useId();

  const browserSelectRef = useRef<unknown>(null);

  const setBrowserSelect = (node: unknown) => {
    browserSelectRef.current = node;
  };

  // On web the primitive names its <select> with the placeholder through
  // aria-label. aria-labelledby takes precedence, so the select is labelled
  // by the trigger, which carries the field's accessible name.
  useEffect(() => {
    const browserSelect = browserSelectRef.current;

    if (Platform.OS !== 'web') {
      return;
    }

    if (browserSelect instanceof HTMLElement) {
      browserSelect.setAttribute('aria-labelledby', triggerId);
    }
  }, [triggerId]);

  return (
    <InputWrapper
      label={label}
      error={error}
      isInvalid={isInvalid}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      size={size}
      containerClassName={containerClassName}
      isFieldDirty={isFieldDirty}
    >
      <TheSelect
        {...remaining}
        selectedValue={selectedItem?.value}
        onValueChange={onChange ?? onValueChange}
      >
        <SelectTrigger
          variant="outline"
          size={size}
          nativeID={triggerId}
          aria-label={ariaLabel}
          accessibilityValue={{ text: selectedItem?.label }}
        >
          <SelectInput
            placeholder={placeholder}
            value={selectedItem?.label ?? ''}
            onChange={noOpFn}
            className="flex-1"
          />
          <SelectIcon
            className="mr-3"
            as={ChevronDownIcon}
          />
        </SelectTrigger>
        <SelectPortal ref={setBrowserSelect}>
          <SelectBackdrop />
          <SelectContent className="pb-6">
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {options.map((option) => (
              <SelectItem
                key={`option-${option.value}`}
                label={option.label}
                value={option.value}
                isDisabled={option.disabled}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </TheSelect>
    </InputWrapper>
  );
};

export { Select };
