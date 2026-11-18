import type { ComponentType, CSSProperties, Ref } from 'react';
import { forwardRef, useCallback } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet } from 'react-native';

import { useDomLayout } from '../hooks/useDomLayout';
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
  // `adapt` la emula con `ResizeObserver` antes de descartarla.
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

// Atributos de `Text` de React Native que se traducen a estilos CSS.
function textStyle(props: ViewProps): CSSProperties | undefined {
  const { numberOfLines, selectable } = props;

  const style: CSSProperties = {};

  let styled = false;

  // `numberOfLines` recorta a N lineas con puntos suspensivos, como en nativo.
  if (typeof numberOfLines === 'number' && numberOfLines > 0) {
    style.display = '-webkit-box';
    style.WebkitBoxOrient = 'vertical';
    style.WebkitLineClamp = numberOfLines;
    style.overflow = 'hidden';
    styled = true;
  }

  if (typeof selectable === 'boolean') {
    style.userSelect = selectable ? 'text' : 'none';
    styled = true;
  }

  return styled ? style : undefined;
}

function toDomTextProps(props: ViewProps): ViewProps {
  const { numberOfLines, selectable, ...rest } = props;

  const dom = toDomProps(rest);

  const nativeStyle = textStyle({ numberOfLines, selectable });

  if (nativeStyle) {
    // El estilo explicito prevalece sobre el derivado de las props nativas.
    dom.style = { ...nativeStyle, ...(dom.style as CSSProperties) };
  }

  return dom;
}

function assignRef(ref: Ref<unknown> | undefined, instance: unknown) {
  if (typeof ref === 'function') {
    ref(instance);
  } else if (ref) {
    ref.current = instance;
  }
}

function adapt<Props>(
  primitive: ComponentType<Props>,
  translate: (props: ViewProps) => ViewProps,
): ComponentType<Props> {
  const Primitive = primitive as ComponentType<ViewProps>;

  const Adapted = forwardRef<unknown, ViewProps>(
    function DomViewProps(props, ref) {
      const layoutRef = useDomLayout(
        props.onLayout as ((event: LayoutChangeEvent) => void) | undefined,
      );

      const setRef = useCallback(
        (instance: unknown) => {
          layoutRef(instance);
          assignRef(ref as Ref<unknown>, instance);
        },
        [layoutRef, ref],
      );

      return (
        <Primitive
          {...translate(props)}
          ref={setRef}
        />
      );
    },
  );

  Adapted.displayName = primitive.displayName ?? primitive.name;

  return Adapted as unknown as ComponentType<Props>;
}

/**
 * En web las plantillas de Gluestack renderizan un `div`, pero el contrato
 * de UI acepta las props de `View`. Traduce esas props a atributos DOM
 * (`accessibilityLabel` → `aria-label`, `testID` → `data-testid`, etc.),
 * emula `onLayout` con `ResizeObserver` y descarta las que no tienen
 * equivalente.
 */
export function withDomViewProps<Props>(
  primitive: ComponentType<Props>,
): ComponentType<Props> {
  return adapt(primitive, toDomProps);
}

/**
 * Igual que `withDomViewProps` para el `span` de `Text`, y ademas traduce
 * `numberOfLines` a un recorte de lineas y `selectable` a `user-select`.
 */
export function withDomTextProps<Props>(
  primitive: ComponentType<Props>,
): ComponentType<Props> {
  return adapt(primitive, toDomTextProps);
}
