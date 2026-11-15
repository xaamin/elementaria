import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

export type VStackProps = ComponentPropsWithoutRef<'div'> & {
  space?: string | number;
  reversed?: string | number | boolean;
} & RefAttributes<HTMLDivElement>;
