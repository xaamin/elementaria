import type { ReactNode } from 'react';

export interface AccessibleNameProps {
  'aria-label'?: string;
  accessibilityLabel?: string;
}

/**
 * Nombre accesible de un control en cualquier plataforma: `aria-label`,
 * despues `accessibilityLabel` y por ultimo el texto visible (`fallback`)
 * cuando es una cadena.
 */
export function accessibleName(
  props: AccessibleNameProps,
  fallback?: ReactNode,
): string | undefined {
  return (
    props['aria-label'] ??
    props.accessibilityLabel ??
    (typeof fallback === 'string' ? fallback : undefined)
  );
}
