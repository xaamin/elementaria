type Props = Record<string, unknown>;

type AccessibilityState = {
  busy?: boolean;
  checked?: boolean | 'mixed';
  disabled?: boolean;
  expanded?: boolean;
  selected?: boolean;
};

type AccessibilityValue = {
  max?: number;
  min?: number;
  now?: number;
  text?: string;
};

// Equivalencias directas, las mismas que aplica react-native-web en `View`.
const RENAMED_PROPS: Record<string, string> = {
  accessibilityLabel: 'aria-label',
  accessibilityLabelledBy: 'aria-labelledby',
  accessibilityRole: 'role',
  accessibilityViewIsModal: 'aria-modal',
};

const ACCESSIBILITY_PROPS = [
  ...Object.keys(RENAMED_PROPS),
  'accessibilityElementsHidden',
  'accessibilityLiveRegion',
  'accessibilityState',
  'accessibilityValue',
  'importantForAccessibility',
];

/**
 * Web: traduce las props `accessibility*` de React Native a sus atributos
 * ARIA (`accessibilityLabel` → `aria-label`, `accessibilityState.checked` →
 * `aria-checked`, `accessibilityElementsHidden` → `aria-hidden`...) y las
 * retira. Los `aria-*` y `role` explicitos prevalecen.
 */
export function platformAccessibilityProps<P extends object>(props: P): P {
  const source = props as Props;
  const result: Props = {};

  Object.keys(source).forEach((key) => {
    if (!ACCESSIBILITY_PROPS.includes(key)) {
      result[key] = source[key];
    }
  });

  const set = (key: string, value: unknown) => {
    if (value !== undefined && result[key] === undefined) {
      result[key] = value;
    }
  };

  Object.keys(RENAMED_PROPS).forEach((key) => {
    set(RENAMED_PROPS[key], source[key]);
  });

  const hidden =
    source.accessibilityElementsHidden === true ||
    source.importantForAccessibility === 'no-hide-descendants';

  if (hidden) {
    set('aria-hidden', true);
  }

  const liveRegion = source.accessibilityLiveRegion;

  if (liveRegion !== undefined) {
    set('aria-live', liveRegion === 'none' ? 'off' : liveRegion);
  }

  const state = source.accessibilityState as AccessibilityState | undefined;

  if (state) {
    set('aria-busy', state.busy);
    set('aria-checked', state.checked);
    set('aria-disabled', state.disabled);
    set('aria-expanded', state.expanded);
    set('aria-selected', state.selected);
  }

  const value = source.accessibilityValue as AccessibilityValue | undefined;

  if (value) {
    set('aria-valuemax', value.max);
    set('aria-valuemin', value.min);
    set('aria-valuenow', value.now);
    set('aria-valuetext', value.text);
  }

  return result as P;
}
