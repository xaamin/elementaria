import type { ColorValue } from 'react-native';

import { cn } from '@/components/cn';
import { Switch as TheSwitch } from '@/components/z/switch';

import { Label } from '../form';
import { HStack } from '../hstack';
import { withFrozenProps } from '../primitive';

export interface SwitchProps {
  label?: string;
  containerClassName?: string;
  labelPosition?: 'left' | 'right';
  value: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  onChange?: () => void;
  accessibilityLabel?: string;
  trackColor?: { false?: ColorValue; true?: ColorValue };
  thumbColor?: ColorValue;
  ios_backgroundColor?: ColorValue;
}

type SwitchPrimitiveProps = Omit<
  SwitchProps,
  'label' | 'containerClassName' | 'labelPosition' | 'disabled' | 'onChange'
> & {
  isDisabled?: boolean;
  onToggle?: () => void;
};

const SwitchPrimitive = withFrozenProps<SwitchPrimitiveProps, 'size'>(
  TheSwitch,
);

export const Switch = ({
  containerClassName,
  label,
  labelPosition = 'left',
  disabled,
  onChange,
  accessibilityLabel,
  ...rest
}: SwitchProps) => {
  const showLabelOnLeft = !!label && labelPosition === 'left';

  const showLabelOnRight = !!label && labelPosition === 'right';

  return (
    <HStack className={cn('items-center w-full gap-2', containerClassName)}>
      {showLabelOnLeft && <Label>{label}</Label>}

      <SwitchPrimitive
        isDisabled={disabled}
        onToggle={onChange}
        accessibilityLabel={accessibilityLabel ?? label}
        {...rest}
      />

      {showLabelOnRight && <Label>{label}</Label>}
    </HStack>
  );
};
