import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

import type { NativeViewWebProps } from '../dom-view-props.types';

export type CardPrimitiveProps = ComponentPropsWithoutRef<'div'> &
  NativeViewWebProps & {
    variant?: string | number;
    size?: string | number;
  } & RefAttributes<HTMLDivElement>;
