import type { ComponentProps } from 'react';
import type { Pressable as RNPressable } from 'react-native';

import { Pressable as ThePressable } from '@/components/z/pressable';

import { withFrozenProps } from '../primitive';

export type PressableProps = ComponentProps<typeof RNPressable>;

const Pressable = withFrozenProps<PressableProps>(ThePressable);

export { Pressable };
