import { forwardRef } from 'react';
import type { ComponentProps, ComponentRef, RefAttributes } from 'react';
import type { View } from 'react-native';

import { cn } from '@/components/cn';
import { Input as TheInput } from '@/components/z/input';

import { withFrozenProps } from '../primitive';

export type InputRootProps = ComponentProps<typeof View> & {
  variant?: string | number;
  size?: string | number;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isHovered?: boolean;
  isFocused?: boolean;
} & RefAttributes<ComponentRef<typeof View>>;

// The v4 primitive has a single size and shape; the frozen `size` and
// `variant` keep the v3 heights and border shapes through classes.
const SIZE_CLASSES: Record<string, string> = {
  sm: 'h-9',
  md: 'h-10',
  lg: 'h-11',
  xl: 'h-12',
};

const VARIANT_CLASSES: Record<string, string> = {
  underlined: 'rounded-none border-0 border-b px-0',
  rounded: 'rounded-full px-4',
};

const InputPrimitive = withFrozenProps<InputRootProps, 'variant' | 'size'>(
  TheInput,
);

/**
 * Contenedor de los campos de texto. Uso interno de `form`; no se exporta
 * desde el barrel.
 */
const InputRoot = forwardRef<
  ComponentRef<typeof View>,
  Omit<InputRootProps, 'ref'>
>(function InputRoot({ size = 'md', variant, className, ...props }, ref) {
  return (
    <InputPrimitive
      {...props}
      ref={ref}
      className={cn(
        SIZE_CLASSES[String(size)],
        VARIANT_CLASSES[String(variant)],
        className,
      )}
    />
  );
});

export { InputRoot };
