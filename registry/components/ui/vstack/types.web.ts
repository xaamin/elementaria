import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

import type { NativeViewWebProps } from '../dom-view-props.types';

export type VStackRef = HTMLDivElement;

export type VStackProps = ComponentPropsWithoutRef<'div'> &
  NativeViewWebProps & {
    space?: string | number;
    reversed?: string | number | boolean;
  } & RefAttributes<VStackRef>;
