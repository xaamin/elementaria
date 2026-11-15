import type { ReactNode } from 'react';

export interface MenuLayerProps {
  isOpen: boolean;
  /** Recibe `true` cuando el menu puede abrirse. */
  children: (isReady: boolean) => ReactNode;
}

/** En nativo los menus usan el overlay de gluestack y no requieren capa propia. */
export function MenuLayer({ isOpen, children }: MenuLayerProps) {
  return children(isOpen);
}
