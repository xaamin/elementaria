import type { ReactNode } from 'react';

/**
 * Item que recibe el foco al abrir el menu: siempre (`true`), nunca (`false`)
 * o solo al abrirlo con el teclado (`'keyboard'`).
 */
export type FocusFirstItem = boolean | 'keyboard';

export interface MenuLayerProps {
  isOpen: boolean;
  focusFirstItem?: FocusFirstItem;
  /** Recibe `true` cuando el menu puede abrirse. */
  children: (isReady: boolean) => ReactNode;
}

/**
 * En nativo los menus usan el overlay de gluestack y no requieren capa propia;
 * el foco del teclado solo se gestiona en web.
 */
export function MenuLayer({ isOpen, children }: MenuLayerProps) {
  return children(isOpen);
}
