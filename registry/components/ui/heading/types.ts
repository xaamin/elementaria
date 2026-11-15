import type { H1 } from '@expo/html-elements';
import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ElementType,
  RefAttributes,
} from 'react';

export type HeadingProps = ComponentPropsWithoutRef<typeof H1> & {
  size?: string | number;
  sub?: string | number | boolean;
  underline?: string | number | boolean;
  italic?: string | number | boolean;
  isTruncated?: string | number | boolean;
  bold?: string | number | boolean;
  strikeThrough?: string | number | boolean;
  highlight?: string | number | boolean;
  as?: ElementType;
} & RefAttributes<ComponentRef<typeof H1>>;
