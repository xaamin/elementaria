import type { ComponentRef, RefAttributes } from 'react';
import type { View, ViewProps } from 'react-native';

export type BoxRef = ComponentRef<typeof View>;

export type BoxProps = ViewProps & RefAttributes<BoxRef>;
