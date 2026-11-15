import { OverlayContainer } from '@gluestack-ui/core/overlay/aria';
import {
  useCallback,
  useContext,
  useState,
  type ComponentRef,
  type ReactNode,
} from 'react';
import { UNSAFE_PortalProvider } from 'react-aria';
import { StyleSheet, View } from 'react-native';

import { MenuLayerContext } from './menuLayerContext';

export interface MenuLayerProps {
  isOpen: boolean;
  /** Recibe `true` cuando el contenedor existe y el menu puede posicionarse. */
  children: (isReady: boolean) => ReactNode;
}

/**
 * React Aria monta el menu en `document.body`, fuera de la raiz de la app y
 * por encima de cualquier dialogo. Mientras el menu esta abierto, esta capa
 * lo monta en el proveedor de overlays de gluestack con un `zIndex` propio
 * para que se apile junto a los dialogos. El menu se abre hasta que el
 * contenedor existe: React Aria solo calcula su posicion al abrirse.
 */
export function MenuLayer({ isOpen, children }: MenuLayerProps) {
  const zIndex = useContext(MenuLayerContext);

  const [container, setContainer] = useState<HTMLElement | null>(null);

  const getContainer = useCallback(() => container, [container]);

  const handleContainer = useCallback(
    (node: ComponentRef<typeof View> | null) => {
      // En react-native-web la referencia de View es el nodo DOM.
      setContainer(node as unknown as HTMLElement | null);
    },
    [],
  );

  return (
    <>
      {isOpen && (
        <OverlayContainer style={{ zIndex }}>
          <View
            ref={handleContainer}
            pointerEvents="box-none"
            style={StyleSheet.absoluteFill}
          />
        </OverlayContainer>
      )}
      <UNSAFE_PortalProvider getContainer={getContainer}>
        {children(isOpen && container !== null)}
      </UNSAFE_PortalProvider>
    </>
  );
}
