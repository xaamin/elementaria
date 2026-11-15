import { VStack as TheVStack } from '@/components/z/vstack';

import { withDomViewProps } from '../dom-view-props';
import { type StackVariantKeys, withFrozenProps } from '../primitive';
import type { VStackProps } from './types';

const VStack = withDomViewProps(
  withFrozenProps<VStackProps, StackVariantKeys>(TheVStack),
);

export type { VStackProps };

export { VStack };
