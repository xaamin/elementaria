import type { ComponentProps, ReactNode } from 'react';
import type { Pressable, View } from 'react-native';

import { CircleIcon } from '@/components/z/icon';
import {
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
  Radio as TheRadioPrimitive,
} from '@/components/z/radio';

import { accessibleName } from '../accessibility';
import { withFrozenProps } from '../primitive';
import { Error } from './Error';
import type { ErrorItem } from './Error';

type RadioPrimitiveProps = ComponentProps<typeof View> &
  ComponentProps<typeof Pressable> & {
    value: string;
    onChange?: (isSelected: boolean) => void;
    children?: ReactNode;
    isDisabled?: boolean;
    isInvalid?: boolean;
    isHovered?: boolean;
    isFocusVisible?: boolean;
    isIndeterminate?: boolean;
    size?: string | number;
  };

const TheRadio = withFrozenProps<RadioPrimitiveProps, 'size'>(
  TheRadioPrimitive,
);

export type RadioProps = RadioPrimitiveProps & {
  label?: ReactNode;
  error?: ErrorItem;
  disabled?: boolean;
};

const Radio = (props: RadioProps) => {
  const { label, error, disabled, isInvalid, onChange, ...rest } = props;

  const ariaLabel = accessibleName(rest, label);

  const handleChange = (selected: string) => {
    onChange?.(selected === rest.value);
  };

  return (
    <RadioGroup onChange={handleChange}>
      <TheRadio
        isInvalid={isInvalid}
        isDisabled={disabled}
        {...rest}
        aria-label={ariaLabel}
      >
        <RadioIndicator>
          <RadioIcon as={CircleIcon} />
        </RadioIndicator>
        <RadioLabel>{label}</RadioLabel>
      </TheRadio>
      <Error error={error} />
    </RadioGroup>
  );
};

export { Radio };
