import type { ComponentRef, RefAttributes } from 'react';
import type { View, ViewProps } from 'react-native';

export type CardPrimitiveProps = ViewProps & {
  variant?: string | number;
  size?: string | number;
} & RefAttributes<ComponentRef<typeof View>>;
