import type { ComponentRef, RefAttributes } from 'react';
import type { View, ViewProps } from 'react-native';

export type HStackProps = ViewProps & {
  space?: string | number;
  reversed?: string | number | boolean;
  responsive?: boolean;
} & RefAttributes<ComponentRef<typeof View>>;
