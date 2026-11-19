import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

import type { NativeViewWebProps } from '../dom-view-props.types';

export type BoxRef = HTMLDivElement;

export type BoxProps = ComponentPropsWithoutRef<'div'> &
  NativeViewWebProps & {
    className?: string;
  } & RefAttributes<BoxRef>;
