import type { ComponentProps } from 'react';
import type { View } from 'react-native';

import { MenuSeparator } from '@/components/z/menu';

import { withFrozenProps } from '../primitive';

export type DropdownDividerProps = ComponentProps<typeof View>;

const DropdownDivider = withFrozenProps<DropdownDividerProps>(MenuSeparator);

export default DropdownDivider;
