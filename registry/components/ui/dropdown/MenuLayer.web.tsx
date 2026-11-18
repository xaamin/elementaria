import { OverlayContainer } from '@gluestack-ui/core/overlay/aria';
import {
  useCallback,
  useContext,
  useEffect,
  useState,
  type ComponentRef,
  type ReactNode,
} from 'react';
import { UNSAFE_PortalProvider } from 'react-aria';
import { StyleSheet, View } from 'react-native';

import { MenuLayerContext } from './menuLayerContext';

/**
 * Item que recibe el foco al abrir el menu: siempre (`true`), nunca (`false`)
 * o solo al abrirlo con el teclado (`'keyboard'`).
 */
export type FocusFirstItem = boolean | 'keyboard';

export interface MenuLayerProps {
  isOpen: boolean;
  focusFirstItem?: FocusFirstItem;
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
const MENU_ITEM = '[role="menuitem"]';

const ENABLED_MENU_ITEM = `${MENU_ITEM}:not([aria-disabled="true"])`;

/**
 * React Aria enfoca la lista al abrir el menu con el puntero y su primer item,
 * aunque este deshabilitado, al abrirlo con el teclado. Este ajuste corrige
 * solo ese foco inicial segun `focusFirstItem`.
 */
function adjustInitialFocus(
  focused: HTMLElement,
  container: HTMLElement,
  focusFirstItem: FocusFirstItem,
) {
  const openedWithKeyboard = focused.matches(MENU_ITEM);

  if (
    focusFirstItem === true ||
    (focusFirstItem === 'keyboard' && openedWithKeyboard)
  ) {
    container.querySelector<HTMLElement>(ENABLED_MENU_ITEM)?.focus();
  } else if (openedWithKeyboard) {
    const list = focused.closest<HTMLElement>('[role="list"]');

    if (!list) {
      return;
    }

    // React Aria conserva el primer item como enfocado: la primera flecha
    // empieza por el primer o el ultimo item habilitado.
    function handleKeyDown(event: KeyboardEvent) {
      if (event.target !== list) {
        list?.removeEventListener('keydown', handleKeyDown, true);

        return;
      }

      const items = Array.from(
        container.querySelectorAll<HTMLElement>(ENABLED_MENU_ITEM),
      );

      let item: HTMLElement | undefined;

      if (event.key === 'ArrowDown') {
        item = items[0];
      } else if (event.key === 'ArrowUp') {
        item = items.at(-1);
      }

      list?.removeEventListener('keydown', handleKeyDown, true);

      if (item) {
        event.preventDefault();
        event.stopPropagation();
        item.focus();
      }
    }

    list.addEventListener('keydown', handleKeyDown, true);
    list.focus();
  }
}

export function MenuLayer({
  isOpen,
  focusFirstItem = 'keyboard',
  children,
}: MenuLayerProps) {
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

  useEffect(() => {
    if (!isOpen || container === null) {
      return;
    }

    const layer = container;

    function handleFocusIn(event: FocusEvent) {
      layer.removeEventListener('focusin', handleFocusIn);

      adjustInitialFocus(event.target as HTMLElement, layer, focusFirstItem);
    }

    // React Aria pudo enfocar el menu antes de este efecto.
    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLElement && layer.contains(activeElement)) {
      adjustInitialFocus(activeElement, layer, focusFirstItem);

      return;
    }

    layer.addEventListener('focusin', handleFocusIn);

    return () => {
      layer.removeEventListener('focusin', handleFocusIn);
    };
  }, [isOpen, container, focusFirstItem]);

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
