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

type ButtonColor =
  'primary' | 'secondary' | 'positive' | 'negative' | 'warning' | 'info';

type ButtonShape = 'solid' | 'outline' | 'link';

type ButtonStyle = { text: string; icon: string };

/**
 * Clases de texto e icono que v3 heredaba por `parentVariants` de
 * `action`/`variant`; el contexto de estilo de la plantilla v5 ya no las
 * transporta.
 */
const ButtonStyleContext = createContext<ButtonStyle | undefined>(undefined);

// Palette of the v3 template (`action` x `variant`). The v5 template only has
// a neutral `variant`, so the wrapper reapplies these classes over it. The
// `secondary` action uses the neutral scales.
const ROOT_ACTION_CLASSES: Record<ButtonColor, string> = {
  primary:
    'bg-primary-500 data-[hover=true]:bg-primary-600 data-[active=true]:bg-primary-700 border-primary-300 data-[hover=true]:border-primary-400 data-[active=true]:border-primary-500 data-[focus-visible=true]:web:ring-primary-300',
  secondary:
    'bg-background-200 border-outline-100 data-[hover=true]:bg-background-300 data-[hover=true]:border-outline-200 data-[active=true]:bg-background-400 data-[active=true]:border-outline-300 data-[focus-visible=true]:web:ring-indicator-info',
  positive:
    'bg-success-500 border-success-300 data-[hover=true]:bg-success-600 data-[hover=true]:border-success-400 data-[active=true]:bg-success-700 data-[active=true]:border-success-500 data-[focus-visible=true]:web:ring-indicator-info',
  negative:
    'bg-error-500 border-error-300 data-[hover=true]:bg-error-600 data-[hover=true]:border-error-400 data-[active=true]:bg-error-700 data-[active=true]:border-error-500 data-[focus-visible=true]:web:ring-indicator-info',
  warning:
    'bg-warning-500 border-warning-300 data-[hover=true]:bg-warning-600 data-[hover=true]:border-warning-400 data-[active=true]:bg-warning-700 data-[active=true]:border-warning-500 data-[focus-visible=true]:web:ring-indicator-info',
  info: 'bg-info-500 border-info-300 data-[hover=true]:bg-info-600 data-[hover=true]:border-info-400 data-[active=true]:bg-info-700 data-[active=true]:border-info-500 data-[focus-visible=true]:web:ring-indicator-info',
};

const ROOT_SHAPE_CLASSES: Record<ButtonShape, string> = {
  solid: '',
  outline:
    'bg-transparent border data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
  link: 'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
};

// Stronger than v3, whose outline borders (`-300`) and text (`-500`) were
// barely visible.
const OUTLINE_BORDER_CLASSES: Record<ButtonColor, string> = {
  primary:
    'border-primary-400 data-[hover=true]:border-primary-500 data-[active=true]:border-primary-600',
  secondary:
    'border-outline-400 data-[hover=true]:border-outline-500 data-[active=true]:border-outline-600',
  positive:
    'border-success-600 data-[hover=true]:border-success-800 data-[active=true]:border-success-800',
  negative:
    'border-error-500 data-[hover=true]:border-error-600 data-[active=true]:border-error-700',
  warning:
    'border-warning-500 data-[hover=true]:border-warning-600 data-[active=true]:border-warning-700',
  info: 'border-info-500 data-[hover=true]:border-info-600 data-[active=true]:border-info-700',
};

const TEXT_ACTION_CLASSES: Record<ButtonColor, string> = {
  primary:
    'text-primary-600 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700',
  secondary:
    'text-typography-700 data-[hover=true]:text-typography-800 data-[active=true]:text-typography-900',
  positive:
    'text-success-600 data-[hover=true]:text-success-800 data-[active=true]:text-success-800',
  negative:
    'text-error-600 data-[hover=true]:text-error-600 data-[active=true]:text-error-700',
  warning:
    'text-warning-600 data-[hover=true]:text-warning-600 data-[active=true]:text-warning-700',
  info: 'text-info-600 data-[hover=true]:text-info-600 data-[active=true]:text-info-700',
};

const SOLID_TEXT_CLASSES: Record<ButtonColor, string> = {
  primary:
    'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
  secondary:
    'text-typography-800 data-[hover=true]:text-typography-800 data-[active=true]:text-typography-800',
  positive:
    'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
  negative:
    'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
  warning:
    'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
  info: 'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
};

// Outline text and icons take the color of the action (v3 used the light
// `primary-500` for every color except secondary).
const OUTLINE_TEXT_CLASSES: Record<ButtonColor, string> = {
  primary:
    'text-primary-600 data-[hover=true]:text-primary-700 data-[active=true]:text-primary-800',
  secondary:
    'text-typography-800 data-[hover=true]:text-typography-900 data-[active=true]:text-typography-900',
  positive:
    'text-success-600 data-[hover=true]:text-success-800 data-[active=true]:text-success-800',
  negative:
    'text-error-600 data-[hover=true]:text-error-700 data-[active=true]:text-error-800',
  warning:
    'text-warning-600 data-[hover=true]:text-warning-700 data-[active=true]:text-warning-800',
  info: 'text-info-600 data-[hover=true]:text-info-700 data-[active=true]:text-info-800',
};

// Solid `secondary` variant: a primary tint, as in the theme recipes.
const SECONDARY_SOLID_ROOT_CLASSES =
  'bg-primary-50 data-[hover=true]:bg-primary-100 data-[active=true]:bg-primary-200 border border-primary-200 data-[hover=true]:border-primary-300 data-[active=true]:border-primary-300';

const SECONDARY_SOLID_TEXT_CLASSES =
  'text-primary-700 data-[hover=true]:text-primary-700 data-[active=true]:text-primary-800';

const LINK_TEXT_CLASSES =
  'data-[hover=true]:underline data-[active=true]:underline';

function buttonStyle(color: ButtonColor, shape: ButtonShape): ButtonStyle {
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

  let color: ButtonColor = 'secondary';

  let outlined = false;

  let newClassName = `self-start ${className}`;

  if (variant) {
    switch (variant) {
      case 'primary':
      case 'secondary':
        color = variant;
        break;
      case 'success':
        color = 'positive';
        break;
      case 'warning':
        color = 'warning';
        break;
      case 'info':
        color = 'info';
        break;
      case 'danger':
        color = 'negative';
        break;
      case 'dark':
        color = 'secondary';
        break;
      case 'outline':
      case 'light':
        color = 'secondary';
        outlined = true;
        newClassName = `${newClassName}`;
        break;
      case 'ghost':
        color = 'secondary';
        outlined = true;
        newClassName = `${newClassName} border-0 bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent`;
        break;
      case 'transparent':
        color = 'secondary';
        newClassName = `${newClassName} border-0 bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent`;
        break;
      case 'link':
        color = 'secondary';
        break;
      default:
        color = 'secondary';
        break;
    }
  }

  let newVariant: ButtonShape = outlined || outline ? 'outline' : 'solid';

  if (variant === 'link') {
    newVariant = 'link';
  }

  const isSecondarySolid = variant === 'secondary' && newVariant === 'solid';

  let style = buttonStyle(color, newVariant);

  if (isSecondarySolid) {
    style = {
      text: SECONDARY_SOLID_TEXT_CLASSES,
      icon: SECONDARY_SOLID_TEXT_CLASSES,
    };
  }

  newClassName = cn(
    'rounded-lg',
    ROOT_ACTION_CLASSES[color],
    ROOT_SHAPE_CLASSES[newVariant],
    newVariant === 'outline' && OUTLINE_BORDER_CLASSES[color],
    isSecondarySolid && SECONDARY_SOLID_ROOT_CLASSES,
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
