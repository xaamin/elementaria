import { Text as TheText } from '@/components/z/text';

import { type TextVariantKeys, withFrozenProps } from '../primitive';
import type { TextProps } from './types';

const Text = withFrozenProps<TextProps, TextVariantKeys>(TheText);

export type { TextProps };

export { Text };
