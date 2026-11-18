import type { ComponentProps, ElementType, RefAttributes } from 'react';
import {
  Children,
  ComponentRef,
  createContext,
  forwardRef,
  ReactNode,
  Ref,
  useContext,
} from 'react';
import type {
  ColorValue,
  Pressable,
  Text,
  TextProps,
  ViewProps,
} from 'react-native';
import { GestureResponderEvent } from 'react-native';
import type { Svg } from 'react-native-svg';

import { cn } from '@/components/cn';
import {
  ButtonIcon as TheButtonIcon,
  ButtonSpinner,
  ButtonText as TheButtonText,
  Button as TheButton,
} from '@/components/z/button';

import { withFrozenProps } from '../primitive';

const Variants = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'dark',
  'light',
  'neutral',
  'link',
  'ghost',
  'outline',
  'transparent',
];

export interface ButtonProps {
  accessibilityLabel?: string;
  isFocused?: boolean;
  isDisabled?: boolean;
  autoFocus?: boolean;
  block?: boolean;
  disabled?: boolean;
  rounded?: boolean;
  outline?: boolean;
  icon?: boolean;
  href?: string;
  type?: 'button' | 'reset' | 'submit';
  variant?: (typeof Variants)[number];
  indeterminate?: boolean;
  children: ReactNode;
  onPress?: () => void;
  onClick?: (e?: GestureResponderEvent) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  ref?: Ref<ComponentRef<typeof Pressable>>;
}

export type ButtonTextProps = TextProps & {
  size?: string | number;
} & RefAttributes<ComponentRef<typeof Text>>;

export type ButtonIconProps = ViewProps & {
  fill?: ColorValue;
  stroke?: ColorValue;
  height?: number;
  width?: number;
  size?: string | number;
  as?: ElementType;
  style?: any;
} & RefAttributes<Svg>;

type ButtonRootProps = Omit<ComponentProps<typeof Pressable>, 'children'> & {
  children?: ReactNode;
  action?: string | number;
  variant?: string | number;
  size?: string | number;
  isDisabled?: boolean;
  isHovered?: boolean;
  isPressed?: boolean;
  isFocused?: boolean;
  isFocusVisible?: boolean;
};

const ButtonRoot = withFrozenProps<
  ButtonRootProps,
  'action' | 'variant' | 'size'
>(TheButton);

const ButtonTextPrimitive = withFrozenProps<ButtonTextProps, 'size'>(
  TheButtonText,
);

const ButtonIconPrimitive = withFrozenProps<ButtonIconProps, 'size'>(
  TheButtonIcon,
);

/** Variants with a palette of their own; the rest use `neutral`. */
const ColorVariants = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'dark',
  'neutral',
] as const;

type ButtonColorVariant = (typeof ColorVariants)[number];

function isColorVariant(variant: string): variant is ButtonColorVariant {
  return (ColorVariants as readonly string[]).includes(variant);
}

type ButtonShape = 'solid' | 'outline' | 'link';

type ButtonStyle = { text: string; icon: string };

/**
 * Clases de texto e icono que v3 heredaba por `parentVariants` de
 * `action`/`variant`; el contexto de estilo de la plantilla v5 ya no las
 * transporta.
 */
const ButtonStyleContext = createContext<ButtonStyle | undefined>(undefined);

// Palette keyed by the public `variant`. The v5 template only has a neutral
// `variant`, so the wrapper reapplies these classes over it. The solid shape
// uses the Badge colors (`-100` background, `-700` text) with a visible
// `-300` border, darkened one step on hover and press. `primary` keeps the
// solid `-500` fill with `typography-0` text and a border matching the fill.
// `neutral` uses the neutral scales (also used by the light, outline, ghost,
// transparent and link variants) and `dark` the fixed `dark` surface, which
// does not invert in dark mode.
const ROOT_ACTION_CLASSES: Record<ButtonColorVariant, string> = {
  primary:
    'bg-primary-500 border-primary-500 data-[hover=true]:bg-primary-600 data-[hover=true]:border-primary-600 data-[active=true]:bg-primary-700 data-[active=true]:border-primary-700 data-[focus-visible=true]:web:ring-primary-300',
  secondary:
    'bg-secondary-100 border-secondary-300 data-[hover=true]:bg-secondary-200 data-[hover=true]:border-secondary-400 data-[active=true]:bg-secondary-300 data-[active=true]:border-secondary-500 data-[focus-visible=true]:web:ring-secondary-300',
  dark: 'bg-fixed-dark border-fixed-dark-hover data-[hover=true]:bg-fixed-dark-hover data-[hover=true]:border-fixed-dark-active data-[active=true]:bg-fixed-dark-active data-[active=true]:border-fixed-dark-active data-[focus-visible=true]:web:ring-indicator-info',
  neutral:
    'bg-background-100 border-outline-300 data-[hover=true]:bg-background-200 data-[hover=true]:border-outline-400 data-[active=true]:bg-background-300 data-[active=true]:border-outline-500 data-[focus-visible=true]:web:ring-indicator-info',
  success:
    'bg-success-100 border-success-300 data-[hover=true]:bg-success-200 data-[hover=true]:border-success-400 data-[active=true]:bg-success-300 data-[active=true]:border-success-500 data-[focus-visible=true]:web:ring-indicator-info',
  danger:
    'bg-error-100 border-error-300 data-[hover=true]:bg-error-200 data-[hover=true]:border-error-400 data-[active=true]:bg-error-300 data-[active=true]:border-error-500 data-[focus-visible=true]:web:ring-indicator-info',
  warning:
    'bg-warning-100 border-warning-300 data-[hover=true]:bg-warning-200 data-[hover=true]:border-warning-400 data-[active=true]:bg-warning-300 data-[active=true]:border-warning-500 data-[focus-visible=true]:web:ring-indicator-info',
  info: 'bg-info-100 border-info-300 data-[hover=true]:bg-info-200 data-[hover=true]:border-info-400 data-[active=true]:bg-info-300 data-[active=true]:border-info-500 data-[focus-visible=true]:web:ring-indicator-info',
};

const ROOT_SHAPE_CLASSES: Record<ButtonShape, string> = {
  solid: 'border',
  outline:
    'bg-transparent border data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
  link: 'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
};

// Stronger than v3, whose outline borders (`-300`) and text (`-500`) were
// barely visible.
const OUTLINE_BORDER_CLASSES: Record<ButtonColorVariant, string> = {
  primary:
    'border-primary-400 data-[hover=true]:border-primary-500 data-[active=true]:border-primary-600',
  secondary:
    'border-secondary-400 data-[hover=true]:border-secondary-500 data-[active=true]:border-secondary-600',
  neutral:
    'border-outline-400 data-[hover=true]:border-outline-500 data-[active=true]:border-outline-600',
  dark: 'border-background-800 data-[hover=true]:border-background-900 data-[active=true]:border-background-950',
  success:
    'border-success-600 data-[hover=true]:border-success-800 data-[active=true]:border-success-800',
  danger:
    'border-error-500 data-[hover=true]:border-error-600 data-[active=true]:border-error-700',
  warning:
    'border-warning-500 data-[hover=true]:border-warning-600 data-[active=true]:border-warning-700',
  info: 'border-info-500 data-[hover=true]:border-info-600 data-[active=true]:border-info-700',
};

const TEXT_ACTION_CLASSES: Record<ButtonColorVariant, string> = {
  primary:
    'text-primary-600 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700',
  secondary:
    'text-secondary-600 data-[hover=true]:text-secondary-600 data-[active=true]:text-secondary-700',
  neutral:
    'text-typography-700 data-[hover=true]:text-typography-800 data-[active=true]:text-typography-900',
  dark: 'text-typography-900 data-[hover=true]:text-typography-900 data-[active=true]:text-typography-950',
  success:
    'text-success-600 data-[hover=true]:text-success-800 data-[active=true]:text-success-800',
  danger:
    'text-error-600 data-[hover=true]:text-error-600 data-[active=true]:text-error-700',
  warning:
    'text-warning-600 data-[hover=true]:text-warning-600 data-[active=true]:text-warning-700',
  info: 'text-info-600 data-[hover=true]:text-info-600 data-[active=true]:text-info-700',
};

const SOLID_TEXT_CLASSES: Record<ButtonColorVariant, string> = {
  primary:
    'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
  secondary:
    'text-secondary-700 data-[hover=true]:text-secondary-800 data-[active=true]:text-secondary-800',
  neutral:
    'text-typography-700 data-[hover=true]:text-typography-800 data-[active=true]:text-typography-800',
  dark: 'text-fixed-dark-foreground data-[hover=true]:text-fixed-dark-foreground data-[active=true]:text-fixed-dark-foreground',
  success:
    'text-success-700 data-[hover=true]:text-success-800 data-[active=true]:text-success-800',
  danger:
    'text-error-700 data-[hover=true]:text-error-800 data-[active=true]:text-error-800',
  warning:
    'text-warning-700 data-[hover=true]:text-warning-800 data-[active=true]:text-warning-800',
  info: 'text-info-700 data-[hover=true]:text-info-800 data-[active=true]:text-info-800',
};

// Outline text and icons take the color of the action (v3 used the light
// `primary-500` for every color except secondary).
const OUTLINE_TEXT_CLASSES: Record<ButtonColorVariant, string> = {
  primary:
    'text-primary-600 data-[hover=true]:text-primary-700 data-[active=true]:text-primary-800',
  secondary:
    'text-secondary-600 data-[hover=true]:text-secondary-700 data-[active=true]:text-secondary-800',
  neutral:
    'text-typography-800 data-[hover=true]:text-typography-900 data-[active=true]:text-typography-900',
  dark: 'text-typography-900 data-[hover=true]:text-typography-950 data-[active=true]:text-typography-950',
  success:
    'text-success-600 data-[hover=true]:text-success-800 data-[active=true]:text-success-800',
  danger:
    'text-error-600 data-[hover=true]:text-error-700 data-[active=true]:text-error-800',
  warning:
    'text-warning-600 data-[hover=true]:text-warning-700 data-[active=true]:text-warning-800',
  info: 'text-info-600 data-[hover=true]:text-info-700 data-[active=true]:text-info-800',
};

// `light` variant: the fixed `light` surface with a soft border; like `dark`,
// it keeps its color in dark mode.
const LIGHT_SOLID_ROOT_CLASSES =
  'bg-fixed-light border border-fixed-light-border data-[hover=true]:bg-fixed-light-hover data-[hover=true]:border-fixed-light-border-hover data-[active=true]:bg-fixed-light-active data-[active=true]:border-fixed-light-border-hover';

const LIGHT_SOLID_TEXT_CLASSES =
  'text-fixed-light-foreground data-[hover=true]:text-fixed-light-foreground data-[active=true]:text-fixed-light-foreground';

const LIGHT_OUTLINE_BORDER_CLASSES =
  'border-outline-200 data-[hover=true]:border-outline-300 data-[active=true]:border-outline-400';

const LINK_TEXT_CLASSES =
  'data-[hover=true]:underline data-[active=true]:underline';

function buttonStyle(
  color: ButtonColorVariant,
  shape: ButtonShape,
): ButtonStyle {
  if (shape === 'solid') {
    return {
      text: SOLID_TEXT_CLASSES[color],
      icon: SOLID_TEXT_CLASSES[color],
    };
  }

  if (shape === 'outline') {
    return {
      text: OUTLINE_TEXT_CLASSES[color],
      icon: OUTLINE_TEXT_CLASSES[color],
    };
  }

  return {
    text: cn(TEXT_ACTION_CLASSES[color], LINK_TEXT_CLASSES),
    icon: cn(LINK_TEXT_CLASSES, TEXT_ACTION_CLASSES[color]),
  };
}

const ButtonText = forwardRef<
  ComponentRef<typeof Text>,
  Omit<ButtonTextProps, 'ref'>
>(function ButtonText({ className, ...props }, ref) {
  const style = useContext(ButtonStyleContext);

  return (
    <ButtonTextPrimitive
      {...props}
      ref={ref}
      className={cn(style?.text, className)}
    />
  );
});

const ButtonIcon = forwardRef<Svg, Omit<ButtonIconProps, 'ref'>>(
  function ButtonIcon({ className, ...props }, ref) {
    const style = useContext(ButtonStyleContext);

    return (
      <ButtonIconPrimitive
        {...props}
        ref={ref}
        className={cn(style?.icon, className)}
      />
    );
  },
);

const Button = (props: ButtonProps) => {
  const {
    indeterminate,
    disabled,
    block,
    variant = 'primary',
    outline,
    rounded,
    icon,
    className = '',
    size,
    autoFocus,
    onPress,
    onClick,
    ...rest
  } = props;

  let color: ButtonColorVariant = 'neutral';

  if (isColorVariant(variant)) {
    color = variant;
  }

  const transparentClassName =
    'border-0 bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent';

  let newClassName = `self-start ${className}`;

  if (variant === 'ghost' || variant === 'transparent') {
    newClassName = `${newClassName} ${transparentClassName}`;
  }

  const outlined = variant === 'outline' || variant === 'ghost';

  let newVariant: ButtonShape = outlined || outline ? 'outline' : 'solid';

  if (variant === 'link') {
    newVariant = 'link';
  }

  const isLightSolid = variant === 'light' && newVariant === 'solid';

  let style = buttonStyle(color, newVariant);

  if (isLightSolid) {
    style = { text: LIGHT_SOLID_TEXT_CLASSES, icon: LIGHT_SOLID_TEXT_CLASSES };
  }

  const isLight = variant === 'light';

  newClassName = cn(
    'rounded-lg',
    ROOT_ACTION_CLASSES[color],
    ROOT_SHAPE_CLASSES[newVariant],
    newVariant === 'outline' && OUTLINE_BORDER_CLASSES[color],
    isLightSolid && LIGHT_SOLID_ROOT_CLASSES,
    isLight && newVariant === 'outline' && LIGHT_OUTLINE_BORDER_CLASSES,
    newClassName,
  );

  if (block) {
    newClassName = `${newClassName} w-full`;
  }

  if (variant === 'ghost') {
    newClassName = `${newClassName} border-0`;
  }

  switch (size) {
    case 'xs':
      newClassName = `${newClassName} h-10`;

      if (icon) {
        newClassName = `${newClassName} w-10 p-0`;
      }
      break;
    case 'sm':
      newClassName = `${newClassName} h-12`;
      break;
    case 'md':
      newClassName = `${newClassName} h-14`;
      break;
    case 'lg':
      newClassName = `${newClassName} h-16`;
      break;
    case 'xl':
      newClassName = `${newClassName} h-[72px]`;
      break;
    default:
      newClassName = `${newClassName} h-14`;
      break;
  }

  if (rounded) {
    const roundedSizes = {
      xs: 'w-10',
      sm: 'w-12',
      md: 'w-14',
      lg: 'w-16',
      xl: 'w-[72px]',
    };

    newClassName = `${newClassName} rounded-full p-0 shrink-0 ${roundedSizes[size ?? 'md']}`;
  }

  const handlePress = () => {
    if (disabled || indeterminate) {
      return;
    }

    onPress?.();
    onClick?.();
  };

  const newProps = {
    className: cn(newClassName),
    variant: newVariant === 'link' ? 'link' : 'default',
    onPress: handlePress,
    isDisabled: disabled || indeterminate || props.isDisabled,
    isFocused: autoFocus || props.isFocused,
    ...rest,
  };

  const renderChildren = () => {
    const children = Children.toArray(props.children);
    const isText = (child: ReactNode) =>
      typeof child === 'string' || typeof child === 'number';

    if (children.length > 0 && children.every(isText)) {
      return <ButtonText>{props.children}</ButtonText>;
    }

    return Children.map(props.children, (child) =>
      isText(child) ? <ButtonText>{child}</ButtonText> : child,
    );
  };

  return (
    <ButtonStyleContext.Provider value={style}>
      <ButtonRoot {...newProps}>
        {indeterminate && <ButtonSpinner />}
        {renderChildren()}
      </ButtonRoot>
    </ButtonStyleContext.Provider>
  );
};

export default Object.assign(Button, {
  Text: ButtonText,
  Icon: ButtonIcon,
});
