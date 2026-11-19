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
import {
  FOCUS_RING_CLASSES,
  isToneVariant,
  OUTLINE_CLASSES,
  SOFT_CLASSES,
  SOLID_CLASSES,
} from '../variants';
import type {
  OutlineClasses,
  SolidVariant,
  ToneClasses,
  ToneVariant,
} from '../variants';

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
] as const;

export type ButtonVariant = (typeof Variants)[number];

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
  variant?: ButtonVariant;
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

type ButtonShape = 'solid' | 'outline' | 'link';

type ButtonStyle = { text: string; icon: string };

/**
 * Clases de texto e icono que v3 heredaba por `parentVariants` de
 * `action`/`variant`; el contexto de estilo de la plantilla v5 ya no las
 * transporta.
 */
const ButtonStyleContext = createContext<ButtonStyle | undefined>(undefined);

// The colors come from the shared variant recipes; this file only adds the
// interactive states. Hover and press darken each recipe one step.
const SOFT_STATE_CLASSES: Record<ToneVariant, ToneClasses> = {
  primary: {
    root: 'data-[hover=true]:bg-primary-200 data-[hover=true]:border-primary-400 data-[active=true]:bg-primary-300 data-[active=true]:border-primary-500',
    text: 'data-[hover=true]:text-primary-800 data-[active=true]:text-primary-800',
  },
  secondary: {
    root: 'data-[hover=true]:bg-secondary-200 data-[hover=true]:border-secondary-400 data-[active=true]:bg-secondary-300 data-[active=true]:border-secondary-500',
    text: 'data-[hover=true]:text-secondary-800 data-[active=true]:text-secondary-800',
  },
  success: {
    root: 'data-[hover=true]:bg-success-200 data-[hover=true]:border-success-400 data-[active=true]:bg-success-300 data-[active=true]:border-success-500',
    text: 'data-[hover=true]:text-success-800 data-[active=true]:text-success-800',
  },
  danger: {
    root: 'data-[hover=true]:bg-error-200 data-[hover=true]:border-error-400 data-[active=true]:bg-error-300 data-[active=true]:border-error-500',
    text: 'data-[hover=true]:text-error-800 data-[active=true]:text-error-800',
  },
  warning: {
    root: 'data-[hover=true]:bg-warning-200 data-[hover=true]:border-warning-400 data-[active=true]:bg-warning-300 data-[active=true]:border-warning-500',
    text: 'data-[hover=true]:text-warning-800 data-[active=true]:text-warning-800',
  },
  info: {
    root: 'data-[hover=true]:bg-info-200 data-[hover=true]:border-info-400 data-[active=true]:bg-info-300 data-[active=true]:border-info-500',
    text: 'data-[hover=true]:text-info-800 data-[active=true]:text-info-800',
  },
  dark: {
    root: 'data-[hover=true]:bg-fixed-dark-hover data-[hover=true]:border-fixed-dark-active data-[active=true]:bg-fixed-dark-active data-[active=true]:border-fixed-dark-active',
    text: '',
  },
  light: {
    root: 'data-[hover=true]:bg-fixed-light-hover data-[hover=true]:border-fixed-light-border-hover data-[active=true]:bg-fixed-light-active data-[active=true]:border-fixed-light-border-hover',
    text: '',
  },
  neutral: {
    root: 'data-[hover=true]:bg-background-200 data-[hover=true]:border-outline-400 data-[active=true]:bg-background-300 data-[active=true]:border-outline-500',
    text: 'data-[hover=true]:text-typography-800 data-[active=true]:text-typography-800',
  },
};

const SOLID_STATE_CLASSES: Record<SolidVariant, string> = {
  primary:
    'data-[hover=true]:bg-primary-700 data-[hover=true]:border-primary-700 data-[active=true]:bg-primary-800 data-[active=true]:border-primary-800',
  danger:
    'data-[hover=true]:bg-fixed-danger-hover data-[hover=true]:border-fixed-danger-hover data-[active=true]:bg-fixed-danger-active data-[active=true]:border-fixed-danger-active',
};

const OUTLINE_STATE_CLASSES: Record<ToneVariant, OutlineClasses> = {
  primary: {
    border:
      'data-[hover=true]:border-primary-600 data-[active=true]:border-primary-700',
    text: 'data-[hover=true]:text-primary-700 data-[active=true]:text-primary-800',
  },
  secondary: {
    border:
      'data-[hover=true]:border-secondary-600 data-[active=true]:border-secondary-700',
    text: 'data-[hover=true]:text-secondary-700 data-[active=true]:text-secondary-800',
  },
  success: {
    border:
      'data-[hover=true]:border-success-600 data-[active=true]:border-success-700',
    text: 'data-[hover=true]:text-success-700 data-[active=true]:text-success-800',
  },
  danger: {
    border:
      'data-[hover=true]:border-error-600 data-[active=true]:border-error-700',
    text: 'data-[hover=true]:text-error-700 data-[active=true]:text-error-800',
  },
  warning: {
    border:
      'data-[hover=true]:border-warning-600 data-[active=true]:border-warning-700',
    text: 'data-[hover=true]:text-warning-700 data-[active=true]:text-warning-800',
  },
  info: {
    border:
      'data-[hover=true]:border-info-600 data-[active=true]:border-info-700',
    text: 'data-[hover=true]:text-info-700 data-[active=true]:text-info-800',
  },
  dark: {
    border:
      'data-[hover=true]:border-background-900 data-[active=true]:border-background-950',
    text: 'data-[hover=true]:text-typography-950 data-[active=true]:text-typography-950',
  },
  light: {
    border:
      'data-[hover=true]:border-outline-600 data-[active=true]:border-outline-700',
    text: 'data-[hover=true]:text-typography-700 data-[active=true]:text-typography-700',
  },
  neutral: {
    border:
      'data-[hover=true]:border-outline-700 data-[active=true]:border-outline-800',
    text: 'data-[hover=true]:text-typography-900 data-[active=true]:text-typography-900',
  },
};

const ROOT_SHAPE_CLASSES: Record<ButtonShape, string> = {
  solid: 'border',
  outline:
    'bg-transparent border data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
  link: 'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
};

const LINK_TEXT_CLASSES =
  'data-[hover=true]:underline data-[active=true]:underline';

function isSolidVariant(color: ToneVariant): color is SolidVariant {
  return color === 'primary' || color === 'danger';
}

/**
 * The highest-emphasis actions (`primary`, and `danger` for destructive
 * actions) use the solid fill; the other variants use the soft recipe shared
 * with Badge and Alert.
 */
function buttonClasses(
  color: ToneVariant,
  shape: ButtonShape,
): { root: string; text: string } {
  if (shape === 'solid' && isSolidVariant(color)) {
    return {
      root: cn(SOLID_CLASSES[color].root, SOLID_STATE_CLASSES[color]),
      text: SOLID_CLASSES[color].text,
    };
  }

  if (shape === 'solid') {
    return {
      root: cn(SOFT_CLASSES[color].root, SOFT_STATE_CLASSES[color].root),
      text: cn(SOFT_CLASSES[color].text, SOFT_STATE_CLASSES[color].text),
    };
  }

  const text = cn(
    OUTLINE_CLASSES[color].text,
    OUTLINE_STATE_CLASSES[color].text,
  );

  if (shape === 'outline') {
    return {
      root: cn(
        OUTLINE_CLASSES[color].border,
        OUTLINE_STATE_CLASSES[color].border,
      ),
      text,
    };
  }

  return { root: '', text: cn(text, LINK_TEXT_CLASSES) };
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

  let color: ToneVariant = 'neutral';

  if (isToneVariant(variant)) {
    color = variant;
  }

  let newClassName = `self-start ${className}`;

  // `ghost` is the outline shape without a border: transparent background
  // that tints on hover. Inside `cn` so `border-0` replaces `border`.
  if (variant === 'ghost') {
    newClassName = `border-0 ${newClassName}`;
  }

  const outlined = variant === 'outline' || variant === 'ghost';

  let newVariant: ButtonShape = outlined || outline ? 'outline' : 'solid';

  if (variant === 'link') {
    newVariant = 'link';
  }

  const { root: colorClassName, text: textClassName } = buttonClasses(
    color,
    newVariant,
  );

  const style = { text: textClassName, icon: textClassName };

  newClassName = cn(
    'rounded-lg',
    ROOT_SHAPE_CLASSES[newVariant],
    colorClassName,
    FOCUS_RING_CLASSES,
    newClassName,
  );

  if (block) {
    newClassName = `${newClassName} w-full`;
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
