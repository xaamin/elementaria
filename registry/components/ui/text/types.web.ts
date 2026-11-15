import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

export type TextProps = ComponentPropsWithoutRef<'span'> & {
  size?: string | number;
  sub?: string | number | boolean;
  underline?: string | number | boolean;
  italic?: string | number | boolean;
  isTruncated?: string | number | boolean;
  bold?: string | number | boolean;
  strikeThrough?: string | number | boolean;
  highlight?: string | number | boolean;
} & RefAttributes<HTMLSpanElement>;
