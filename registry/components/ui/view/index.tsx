import type { ComponentProps, FunctionComponent } from 'react';
import type { View as RNView } from 'react-native';

import { View as TheView } from '@/components/z/view';

export type ViewProps = ComponentProps<typeof RNView>;

const View: FunctionComponent<ViewProps> = TheView;

export { View };
