import type { ComponentRef, RefAttributes } from 'react';
import type { View, ViewProps } from 'react-native';

export type BoxProps = ViewProps & RefAttributes<ComponentRef<typeof View>>;
