import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

import type { NativeViewWebProps } from '../dom-view-props.types';

export type GridPrimitiveProps = ComponentPropsWithoutRef<'div'> &
  NativeViewWebProps & {
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
