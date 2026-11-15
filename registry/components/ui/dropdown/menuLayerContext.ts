import { createContext } from 'react';

/**
 * Capas de los menus en web. Los dialogos de gluestack usan `zIndex` 9999
 * dentro del proveedor de overlays: los menus normales quedan debajo de ellos
 * y los abiertos dentro de un dialogo, encima de ese dialogo.
 */
export const MENU_LAYER_BASE = 9000;

export const MENU_LAYER_DIALOG = 10000;

export const MenuLayerContext = createContext(MENU_LAYER_BASE);
