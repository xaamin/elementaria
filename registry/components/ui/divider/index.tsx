import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  RefAttributes,
} from 'react';
import { forwardRef } from 'react';
import type { View } from 'react-native';

import { cn } from '@/components/cn';
import { Divider as TheDivider } from '@/components/z/divider';

import { withFrozenProps } from '../primitive';

export type DividerProps = ComponentPropsWithoutRef<typeof View> & {
  orientation?: string | number;
} & RefAttributes<ComponentRef<typeof View>>;

const DividerPrimitive = withFrozenProps<DividerProps, 'orientation'>(
  TheDivider,
);

/**
 * La plantilla dibuja la linea horizontal con `w-auto`, que queda con ancho
 * cero dentro de un padre con `items-center` o de una fila. `w-full` ocupa el
 * ancho disponible en ambos casos; un `w-*` del consumidor sigue prevaleciendo.
 */
const Divider = forwardRef<
  ComponentRef<typeof View>,
  Omit<DividerProps, 'ref'>
>(function Divider({ className, orientation = 'horizontal', ...props }, ref) {
  let resolvedClassName = className;

  if (orientation !== 'vertical') {
    resolvedClassName = cn('w-full', className);
  }

  return (
    <DividerPrimitive
      {...props}
      ref={ref}
      orientation={orientation}
      className={resolvedClassName}
    />
  );
});

Divider.displayName = 'Divider';

export { Divider };
