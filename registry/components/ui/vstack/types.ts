import type { ComponentRef, RefAttributes } from 'react';
import type { View, ViewProps } from 'react-native';

export type VStackRef = ComponentRef<typeof View>;

export type VStackProps = ViewProps & {
  space?: string | number;
  reversed?: string | number | boolean;
} & RefAttributes<VStackRef>;
