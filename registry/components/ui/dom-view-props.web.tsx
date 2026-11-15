import type { ComponentType, CSSProperties, Ref } from 'react';
import { forwardRef } from 'react';
import { StyleSheet } from 'react-native';

import { platformAccessibilityProps } from './accessibility';

type ViewProps = Record<string, unknown>;

// Props de React Native sin equivalente en un `div`: se descartan para que
// React DOM no las publique como atributos desconocidos.
const NATIVE_ONLY_PROPS = [
  'accessible',
  'accessibilityActions',
  'accessibilityHint',
  'accessibilityIgnoresInvertColors',
  'accessibilityLanguage',
  'accessibilityLargeContentTitle',
  'accessibilityShowsLargeContentViewer',
  'collapsable',
  'focusable',
  'hitSlop',
  'needsOffscreenAlphaCompositing',
  'onAccessibilityAction',
  'onAccessibilityEscape',
  'onAccessibilityTap',
  'onLayout',
  'onMagicTap',
  'removeClippedSubviews',
  'renderToHardwareTextureAndroid',
  'shouldRasterizeIOS',
];

// Props de React Native con un atributo DOM equivalente fuera de ARIA.
const RENAMED_PROPS: Record<string, string> = {
  nativeID: 'id',
  testID: 'data-testid',
};

function toDomProps(props: ViewProps): ViewProps {
  const { pointerEvents, style, ...rest } = platformAccessibilityProps(props);

  const dom: ViewProps = {};

  Object.keys(rest).forEach((key) => {
    if (NATIVE_ONLY_PROPS.includes(key)) {
      return;
    }

    const domKey = RENAMED_PROPS[key];

    if (domKey) {
      // Los atributos DOM explicitos prevalecen sobre las props nativas.
      if (rest[domKey] === undefined) {
        dom[domKey] = rest[key];
      }

      return;
    }

    dom[key] = rest[key];
  });

  // `div` solo acepta un objeto de estilo; los arreglos de React Native se
  // aplanan. `box-none` y `box-only` no tienen equivalente CSS directo.
  const flatStyle = {
    ...(StyleSheet.flatten(
      style as Parameters<typeof StyleSheet.flatten>[0],
    ) as CSSProperties),
  };

  if (pointerEvents === 'none' || pointerEvents === 'auto') {
    flatStyle.pointerEvents = pointerEvents;
  }

  if (style !== undefined || flatStyle.pointerEvents !== undefined) {
    dom.style = flatStyle;
  }

  return dom;
}

/**
 * En web las plantillas de Gluestack renderizan un `div`, pero el contrato
 * de UI acepta las props de `View`. Traduce esas props a atributos DOM
 * (`accessibilityLabel` → `aria-label`, `testID` → `data-testid`, etc.)
 * y descarta las que no tienen equivalente.
 */
export function withDomViewProps<Props>(
  primitive: ComponentType<Props>,
): ComponentType<Props> {
  const Primitive = primitive as ComponentType<ViewProps>;

  const Adapted = forwardRef<unknown, ViewProps>(
    function DomViewProps(props, ref) {
      return (
        <Primitive
          {...toDomProps(props)}
          ref={ref as Ref<unknown>}
        />
      );
    },
  );

  Adapted.displayName = primitive.displayName ?? primitive.name;

  return Adapted as unknown as ComponentType<Props>;
}
