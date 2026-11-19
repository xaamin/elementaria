import type { FunctionComponent } from 'react';

import { Box as TheBox } from '@/components/z/box';

import { withDomViewProps } from '../dom-view-props';
import type { BoxProps, BoxRef } from './types';

const FrozenBox: FunctionComponent<BoxProps> = TheBox;

const Box = withDomViewProps(FrozenBox);

export type { BoxProps, BoxRef };

export { Box };
