import type { ComponentProps, FunctionComponent } from 'react';
import type { ActivityIndicator } from 'react-native';

import { Spinner as TheSpinner } from '@/components/z/spinner';

export type SpinnerProps = ComponentProps<typeof ActivityIndicator>;

const Spinner: FunctionComponent<SpinnerProps> = TheSpinner;

export { Spinner };
