import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import { useLayoutEffect, type ReactNode } from 'react';

import type { ModeType } from '@/components/z/gluestack-ui-provider';

export type UIThemeProviderProps = {
  mode?: ModeType;
  children?: ReactNode;
};

function resolveMode(mode: ModeType) {
  if (mode !== 'system') {
    return mode;
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

function applyMode(mode: ModeType) {
  const theme = resolveMode(mode);
  const documentElement = document.documentElement;

  documentElement.classList.remove(theme === 'light' ? 'dark' : 'light');
  documentElement.classList.add(theme);
  documentElement.style.colorScheme = theme;
}

/**
 * Proveedor de tema de la aplicación en web. Compone los proveedores de
 * overlays y toasts de Gluestack y agrega la clase del modo (`light`/`dark`)
 * a `<html>`. Al desmontarse o cambiar de modo restaura el modo previo, de
 * modo que un proveedor anidado (p. ej. en `/demos`) no deja su modo en el
 * resto de la aplicación. Las variables de la paleta v3 y los tokens de las plantillas se
 * declaran en `global.css`.
 *
 * No reutiliza el `GluestackUIProvider` web de `components/z` porque este
 * renderiza un `<script>` en línea que React nunca ejecuta en el cliente y
 * que provoca la advertencia "Encountered a script tag while rendering React
 * component".
 */
export function UIThemeProvider({
  mode = 'light',
  children,
}: UIThemeProviderProps) {
  useLayoutEffect(() => {
    const documentElement = document.documentElement;

    const hadDark = documentElement.classList.contains('dark');

    const hadLight = documentElement.classList.contains('light');

    const previousColorScheme = documentElement.style.colorScheme;

    let media: MediaQueryList | undefined;

    const handleChange = () => {
      applyMode(mode);
    };

    applyMode(mode);

    if (mode === 'system') {
      media = window.matchMedia('(prefers-color-scheme: dark)');

      media.addEventListener('change', handleChange);
    }

    return () => {
      media?.removeEventListener('change', handleChange);

      documentElement.classList.toggle('dark', hadDark);
      documentElement.classList.toggle('light', hadLight);
      documentElement.style.colorScheme = previousColorScheme;
    };
  }, [mode]);

  return (
    <OverlayProvider>
      <ToastProvider>{children}</ToastProvider>
    </OverlayProvider>
  );
}
