import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

import type { NativeViewWebProps } from '../dom-view-props.types';

export type HStackProps = ComponentPropsWithoutRef<'div'> &
  NativeViewWebProps & {
    space?: string | number;
    reversed?: string | number | boolean;
    responsive?: boolean;
  } & RefAttributes<HTMLDivElement>;
