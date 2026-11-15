import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

export type CardPrimitiveProps = ComponentPropsWithoutRef<'div'> & {
  variant?: string | number;
  size?: string | number;
} & RefAttributes<HTMLDivElement>;
