import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

export type CenterProps = ComponentPropsWithoutRef<'div'> &
  RefAttributes<HTMLDivElement>;
