import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

export type HStackProps = ComponentPropsWithoutRef<'div'> & {
  space?: string | number;
  reversed?: string | number | boolean;
  responsive?: boolean;
} & RefAttributes<HTMLDivElement>;
