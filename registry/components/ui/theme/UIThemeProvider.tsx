import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import {
  GluestackUIProvider,
  type ModeType,
} from '@/components/z/gluestack-ui-provider';

export type UIThemeProviderProps = {
  mode?: ModeType;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Proveedor de tema de la aplicación. Envuelve al de `components/z`, que
 * fija el esquema de color con `Appearance`; las variables de la paleta v3 y
 * los tokens de las plantillas se declaran en `global.css`.
 */
export function UIThemeProvider({
  mode = 'light',
  children,
  style,
}: UIThemeProviderProps) {
  return (
    <GluestackUIProvider
      mode={mode}
      style={style}
    >
      {children}
    </GluestackUIProvider>
  );
}
