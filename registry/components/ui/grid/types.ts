import type { ComponentRef, RefAttributes } from 'react';
import type { View, ViewProps } from 'react-native';

export type GridPrimitiveProps = ViewProps & {
  gap?: number;
  rowGap?: number;
  columnGap?: number;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  padding?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingStart?: number;
  paddingEnd?: number;
  borderWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  _extra?: {
    className: string;
  };
} & RefAttributes<ComponentRef<typeof View>>;

export type GridPrimitiveElement = ComponentRef<typeof View>;
