import type {
  ComponentPropsWithoutRef,
  ElementType,
  RefAttributes,
} from 'react';

export type HeadingProps = ComponentPropsWithoutRef<'h1'> & {
  size?: string | number;
  sub?: string | number | boolean;
  underline?: string | number | boolean;
  italic?: string | number | boolean;
  isTruncated?: string | number | boolean;
  bold?: string | number | boolean;
  strikeThrough?: string | number | boolean;
  highlight?: string | number | boolean;
  as?: ElementType;
} & RefAttributes<HTMLHeadingElement>;
