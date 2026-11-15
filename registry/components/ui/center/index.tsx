import type { FunctionComponent } from 'react';

import { Center as TheCenter } from '@/components/z/center';

import { withDomViewProps } from '../dom-view-props';
import type { CenterProps } from './types';

const FrozenCenter: FunctionComponent<CenterProps> = TheCenter;

const Center = withDomViewProps(FrozenCenter);

export type { CenterProps };

export { Center };
