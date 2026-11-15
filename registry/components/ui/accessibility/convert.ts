type Props = Record<string, unknown>;

// Equivalencias directas entre ARIA y React Native.
const RENAMED_PROPS: Record<string, string> = {
  'aria-label': 'accessibilityLabel',
  'aria-labelledby': 'accessibilityLabelledBy',
  'aria-modal': 'accessibilityViewIsModal',
};

const STATE_PROPS: Record<string, string> = {
  'aria-busy': 'busy',
  'aria-checked': 'checked',
  'aria-disabled': 'disabled',
  'aria-expanded': 'expanded',
  'aria-selected': 'selected',
};

const VALUE_PROPS: Record<string, string> = {
  'aria-valuemax': 'max',
  'aria-valuemin': 'min',
  'aria-valuenow': 'now',
  'aria-valuetext': 'text',
};

const ARIA_PROPS = [
  ...Object.keys(RENAMED_PROPS),
  ...Object.keys(STATE_PROPS),
  ...Object.keys(VALUE_PROPS),
  'aria-hidden',
  'aria-live',
];

// Agrupa los `aria-*` presentes en el objeto de React Native (`accessibilityState`,
// `accessibilityValue`); las claves del objeto explicito prevalecen.
function group(
  source: Props,
  names: Record<string, string>,
  explicit: unknown,
) {
  const grouped: Props = {};

  Object.keys(names).forEach((key) => {
    if (source[key] !== undefined) {
      grouped[names[key]] = source[key];
    }
  });

  if (Object.keys(grouped).length === 0) {
    return explicit;
  }

  return { ...grouped, ...(explicit as Props | undefined) };
}

/**
 * Android/iOS: traduce los atributos ARIA a las props `accessibility*` de
 * React Native (`aria-label` → `accessibilityLabel`, `aria-checked` →
 * `accessibilityState.checked`, `aria-hidden` → `accessibilityElementsHidden`
 * e `importantForAccessibility`...) y los retira. Las props `accessibility*`
 * explicitas prevalecen. `role` se conserva: React Native lo entiende.
 */
export function platformAccessibilityProps<P extends object>(props: P): P {
  const source = props as Props;
  const result: Props = {};

  Object.keys(source).forEach((key) => {
    if (!ARIA_PROPS.includes(key)) {
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

  if (source['aria-hidden'] === true || source['aria-hidden'] === 'true') {
    set('accessibilityElementsHidden', true);
    set('importantForAccessibility', 'no-hide-descendants');
  }

  const live = source['aria-live'];

  if (live !== undefined) {
    set('accessibilityLiveRegion', live === 'off' ? 'none' : live);
  }

  const state = group(source, STATE_PROPS, source.accessibilityState);

  if (state !== undefined) {
    result.accessibilityState = state;
  }

  const value = group(source, VALUE_PROPS, source.accessibilityValue);

  if (value !== undefined) {
    result.accessibilityValue = value;
  }

  return result as P;
}
