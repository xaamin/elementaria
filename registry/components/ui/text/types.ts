import type { ComponentProps } from 'react';
import type { Text } from 'react-native';

export type TextProps = ComponentProps<typeof Text> & {
  size?: string | number;
  sub?: string | number | boolean;
  underline?: string | number | boolean;
  italic?: string | number | boolean;
  isTruncated?: string | number | boolean;
  bold?: string | number | boolean;
  strikeThrough?: string | number | boolean;
  highlight?: string | number | boolean;
};
