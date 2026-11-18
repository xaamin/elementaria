import { useCallback, useLayoutEffect, useRef } from 'react';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';

type OnLayout = (event: LayoutChangeEvent) => void;

// Posicion relativa al padre y tamano sin transformaciones, como `onLayout`.
function measure(node: HTMLElement): LayoutRectangle {
  const rect = node.getBoundingClientRect();

  const parent = node.parentElement?.getBoundingClientRect();

  return {
    x: rect.left - (parent?.left ?? 0),
    y: rect.top - (parent?.top ?? 0),
    width: node.offsetWidth,
    height: node.offsetHeight,
  };
}

function sameLayout(a: LayoutRectangle, b: LayoutRectangle) {
  return (
    a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
  );
}

/**
 * Web: emula `onLayout` de React Native sobre un elemento DOM. Lo invoca al
 * montarse y despues con `ResizeObserver` cada vez que cambia su tamano,
 * con un evento `{ nativeEvent: { layout: { x, y, width, height } } }`.
 * Devuelve el ref que debe recibir el elemento. Sin `onLayout` no observa.
 */
export function useDomLayout(onLayout: OnLayout | undefined) {
  const node = useRef<HTMLElement | null>(null);

  const callback = useRef(onLayout);

  const observing = typeof onLayout === 'function';

  useLayoutEffect(() => {
    callback.current = onLayout;
  });

  useLayoutEffect(() => {
    const element = node.current;

    if (!observing || !element) {
      return;
    }

    let last: LayoutRectangle | undefined;

    const emit = () => {
      const layout = measure(element);

      if (last && sameLayout(last, layout)) {
        return;
      }

      last = layout;

      callback.current?.({
        nativeEvent: { layout, target: element },
        currentTarget: element,
        target: element,
        timeStamp: Date.now(),
        type: 'layout',
      } as unknown as LayoutChangeEvent);
    };

    emit();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(emit);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [observing]);

  return useCallback((instance: unknown) => {
    node.current = instance instanceof HTMLElement ? instance : null;
  }, []);
}
