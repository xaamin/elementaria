import { MinusIcon } from 'lucide-react-native';
import type { ComponentProps } from 'react';
import type { View } from 'react-native';

import { cn } from '@/components/cn';
import {
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  Checkbox as TheCheckboxPrimitive,
} from '@/components/z/checkbox';
import { CheckIcon } from '@/components/z/icon';

import { accessibleName } from '../accessibility';
import { withFrozenProps } from '../primitive';
import { InputWrapper } from './InputWrapper';
import type { InputWrapperProps } from './InputWrapper';

type CheckboxPrimitiveProps = ComponentProps<typeof View> & {
  value: string;
  isHovered?: boolean;
  isFocusVisible?: boolean;
  onChange?: (isSelected: boolean) => void;
  isIndeterminate?: boolean;
  defaultIsChecked?: boolean;
  isChecked?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  size?: string | number;
  context?: any;
};

const TheCheckbox = withFrozenProps<CheckboxPrimitiveProps, 'size'>(
  TheCheckboxPrimitive,
);

export type CheckboxProps = Omit<
  CheckboxPrimitiveProps,
  keyof InputWrapperProps | 'value'
> &
  InputWrapperProps & {
    value?: string;
    checked?: boolean;
    disabled?: boolean;
  };

const Checkbox = (props: CheckboxProps) => {
  const {
    children,
    label,
    error,
    disabled,
    isInvalid,
    isRequired,
    isDisabled,
    isReadOnly,
    size,
    containerClassName,
    isFieldDirty,
    checked,
    isIndeterminate,
    value,
    helperText,
    ...rest
  } = props;

  const content = children || label;
  const ariaLabel = accessibleName(rest, content);

  return (
    <InputWrapper
      error={error}
      isInvalid={isInvalid}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      size={size}
      containerClassName={containerClassName}
      isFieldDirty={isFieldDirty}
      helperText={helperText}
    >
      <TheCheckbox
        isInvalid={isInvalid}
        isChecked={checked}
        isIndeterminate={isIndeterminate}
        value={value ?? ''}
        {...rest}
        aria-label={ariaLabel}
      >
        <CheckboxIndicator
          className={cn(
            'w-5 h-5 border-2',
            isIndeterminate && 'bg-primary-600 border-primary-600',
          )}
        >
          <CheckboxIcon
            as={isIndeterminate ? MinusIcon : CheckIcon}
            forceMount={isIndeterminate}
            className="h-4 w-4"
          />
        </CheckboxIndicator>
        <CheckboxLabel className="text-base">{content}</CheckboxLabel>
      </TheCheckbox>
    </InputWrapper>
  );
};

export { Checkbox };
