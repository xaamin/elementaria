import { VStack as TheVStack } from '@/components/z/vstack';

import { withDomViewProps } from '../dom-view-props';
import { type StackVariantKeys, withFrozenProps } from '../primitive';
import type { VStackProps, VStackRef } from './types';

const VStack = withDomViewProps(
  withFrozenProps<VStackProps, StackVariantKeys>(TheVStack),
);

export type { VStackProps, VStackRef };

export { VStack };
