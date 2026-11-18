import type { TextProps as NativeTextProps, ViewProps } from 'react-native';

/**
 * Props de `View` de React Native que el contrato web de los contenedores
 * acepta porque `withDomViewProps` las traduce al `div` (`testID` →
 * `data-testid`, `accessibility*` → ARIA, `pointerEvents` → estilo) o las
 * descarta cuando no tienen equivalente (`onLayout`, `hitSlop`...).
 */
export type NativeViewWebProps = Pick<
  ViewProps,
  | 'accessible'
  | 'accessibilityElementsHidden'
  | 'accessibilityHint'
  | 'accessibilityLabel'
  | 'accessibilityLabelledBy'
  | 'accessibilityLiveRegion'
  | 'accessibilityRole'
  | 'accessibilityState'
  | 'accessibilityValue'
  | 'accessibilityViewIsModal'
  | 'collapsable'
  | 'focusable'
  | 'hitSlop'
  | 'importantForAccessibility'
  | 'nativeID'
  | 'onLayout'
  | 'pointerEvents'
  | 'testID'
>;

/**
 * Props de `Text` de React Native que el contrato web de `Text` acepta porque
 * `withDomTextProps` las traduce al `span`: las de accesibilidad e
 * identificacion de `NativeViewWebProps`, `numberOfLines` (recorte de lineas)
 * y `selectable` (`user-select`).
 */
export type NativeTextWebProps = Omit<
  NativeViewWebProps,
  'collapsable' | 'hitSlop' | 'pointerEvents'
> &
  Pick<NativeTextProps, 'numberOfLines' | 'selectable'>;
