import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

export type GridPrimitiveProps = ComponentPropsWithoutRef<'div'> & {
  gap?: number;
  rowGap?: number;
  columnGap?: number;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  padding?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingStart?: number;
  paddingEnd?: number;
  _extra?: {
    className: string;
  };
} & RefAttributes<HTMLDivElement>;

export type GridPrimitiveElement = HTMLDivElement;
