import type {
  ComponentProps,
  ComponentRef,
  CSSProperties,
  ReactNode,
  RefAttributes,
} from 'react';
import { createContext, forwardRef, useContext } from 'react';
import type { Text, View } from 'react-native';

import { cn } from '@/components/cn';
import {
  Toast as BaseToast,
  ToastDescription as BaseToastDescription,
  ToastTitle as BaseToastTitle,
  useToast as useBaseToast,
} from '@/components/z/toast';

import { withFrozenProps } from '../primitive';

export type ToastProps = ComponentProps<typeof View> & {
  /** Color: equivale al `action` de Gluestack (`danger` → `error`). */
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light';
  /** Variante `outline` de Gluestack; sin ella, `solid`. */
  outline?: boolean;
  context?: any;
} & RefAttributes<ComponentRef<typeof View>>;

type ToastRootPrimitiveProps = Omit<ToastProps, 'variant' | 'outline'> & {
  variant?: string | number;
  action?: string | number;
};

type ToastTextSize =
  | 'sm'
  | 'md'
  | 'lg'
  | '2xs'
  | 'xs'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl';

export type ToastDescriptionProps = ComponentProps<typeof Text> & {
  size?: ToastTextSize;
  underline?: boolean;
  isTruncated?: boolean;
  bold?: boolean;
  strikeThrough?: boolean;
};

export type ToastTitleProps = ToastDescriptionProps;

type ToastPlacement =
  'top' | 'top right' | 'top left' | 'bottom' | 'bottom left' | 'bottom right';

export type ToastShowOptions = {
  duration?: number | null;
  id?: string;
  onCloseComplete?: () => void;
  placement?: ToastPlacement;
  render?: (props: { id: string }) => ReactNode;
  avoidKeyboard?: boolean;
  containerStyle?: CSSProperties;
};

export type ToastController = {
  show: (props: ToastShowOptions) => string;
  close: (id: string) => void;
  closeAll: () => void;
  isActive: (id: string) => boolean;
};

const ToastDescriptionPrimitive =
  withFrozenProps<ToastDescriptionProps>(BaseToastDescription);

const ToastTitlePrimitive = withFrozenProps<ToastTitleProps>(BaseToastTitle);

const useToast: () => ToastController = useBaseToast;

const ToastRootPrimitive = withFrozenProps<
  ToastRootPrimitiveProps,
  'variant' | 'action'
>(BaseToast);

type ToastAction = 'error' | 'warning' | 'success' | 'info' | 'muted';

type ToastStyle = { title: string; description: string };

/**
 * Clases de título y descripción que v3 heredaba por `parentVariants` de
 * `action`/`variant`; la plantilla v5 pinta todas las acciones igual.
 */
const ToastStyleContext = createContext<ToastStyle | undefined>(undefined);

// v3 palette: solid toasts are filled by `action`, outline ones are light.
// The default `muted` solid toast keeps the light v5 template instead.
const SOLID_ROOT_CLASSES: Record<Exclude<ToastAction, 'muted'>, string> = {
  error: 'bg-error-800',
  warning: 'bg-warning-700',
  success: 'bg-success-700',
  info: 'bg-info-700',
};

const OUTLINE_TITLE_CLASSES: Record<ToastAction, string> = {
  error: 'text-error-800',
  warning: 'text-warning-800',
  success: 'text-success-800',
  info: 'text-info-800',
  muted: 'text-background-800',
};

function toastAction(variant: ToastProps['variant']): ToastAction {
  switch (variant) {
    case 'warning':
    case 'success':
    case 'info':
      return variant;
    case 'danger':
      return 'error';
    default:
      return 'muted';
  }
}

const ToastRoot = forwardRef<
  ComponentRef<typeof View>,
  Omit<ToastProps, 'ref'>
>(function Toast({ variant, outline = false, className, ...props }, ref) {
  const color = toastAction(variant);

  let rootClassName: string | undefined;

  let style: ToastStyle | undefined;

  if (outline) {
    rootClassName = 'border border-outline-100 bg-background-0 shadow-hard-5';

    style = {
      title: OUTLINE_TITLE_CLASSES[color],
      description: 'text-typography-900',
    };
  } else if (color !== 'muted') {
    rootClassName = cn('border-0 shadow-hard-5', SOLID_ROOT_CLASSES[color]);

    style = {
      title: 'text-typography-0',
      description: 'text-typography-50',
    };
  }

  return (
    <ToastStyleContext.Provider value={style}>
      <ToastRootPrimitive
        {...props}
        ref={ref}
        variant={outline ? 'outline' : 'solid'}
        action={color}
        className={cn(rootClassName, className)}
      />
    </ToastStyleContext.Provider>
  );
});

const ToastTitle = forwardRef<
  ComponentRef<typeof Text>,
  Omit<ToastTitleProps, 'ref'>
>(function ToastTitle({ className, ...props }, ref) {
  const style = useContext(ToastStyleContext);

  return (
    <ToastTitlePrimitive
      {...props}
      ref={ref}
      className={cn(style?.title, className)}
    />
  );
});

const ToastDescription = forwardRef<
  ComponentRef<typeof Text>,
  Omit<ToastDescriptionProps, 'ref'>
>(function ToastDescription({ className, ...props }, ref) {
  const style = useContext(ToastStyleContext);

  return (
    <ToastDescriptionPrimitive
      {...props}
      ref={ref}
      className={cn(style?.description, className)}
    />
  );
});

const Toast = Object.assign(ToastRoot, {
  Description: ToastDescription,
  Title: ToastTitle,
});

export { Toast, ToastDescription, ToastTitle, useToast };
