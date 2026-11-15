import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

export type BoxProps = ComponentPropsWithoutRef<'div'> & {
  className?: string;
} & RefAttributes<HTMLDivElement>;
