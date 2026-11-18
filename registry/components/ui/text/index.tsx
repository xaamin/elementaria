import { Text as TheText } from '@/components/z/text';

import { withDomTextProps } from '../dom-view-props';
import { type TextVariantKeys, withFrozenProps } from '../primitive';
import type { TextProps } from './types';

const Text = withDomTextProps(
  withFrozenProps<TextProps, TextVariantKeys>(TheText),
);

export type { TextProps };

export { Text };
