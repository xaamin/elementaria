import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

import type { NativeViewWebProps } from '../dom-view-props.types';

export type CenterProps = ComponentPropsWithoutRef<'div'> &
  NativeViewWebProps &
  RefAttributes<HTMLDivElement>;
