import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

import type { NativeTextWebProps } from '../dom-view-props.types';

export type TextProps = ComponentPropsWithoutRef<'span'> &
  NativeTextWebProps & {
    size?: string | number;
    sub?: string | number | boolean;
    underline?: string | number | boolean;
    italic?: string | number | boolean;
    isTruncated?: string | number | boolean;
    bold?: string | number | boolean;
    strikeThrough?: string | number | boolean;
    highlight?: string | number | boolean;
  } & RefAttributes<HTMLSpanElement>;
