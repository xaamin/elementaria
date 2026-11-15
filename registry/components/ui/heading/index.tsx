import { Heading as TheHeading } from '@/components/z/heading';

import { type TextVariantKeys, withFrozenProps } from '../primitive';
import type { HeadingProps } from './types';

const Heading = withFrozenProps<HeadingProps, TextVariantKeys>(TheHeading);

export type { HeadingProps };

export { Heading };
