import React, {
  Children,
  ComponentRef,
  forwardRef,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { twMerge } from 'tailwind-merge';

import { AlertText, Alert as TheAlert } from '@/components/z/alert';

import { Heading } from '../heading';
import { CloseIcon, Icon } from '../icon';
import { Pressable } from '../pressable';
import { VStack } from '../vstack';
import type { VStackRef } from '../vstack';

const Variant = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'dark',
  'light',
  'neutral',
] as const;

export interface AlertProps {
  dismissible?: boolean;
  outline?: boolean;
  onClose?: (event: unknown) => void;
  show?: boolean;
  className?: string;
  variant?: (typeof Variant)[number];
  description?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
}

export type AlertHeadingProps = PropsWithChildren & { className?: string };
export type AlertDescriptionProps = PropsWithChildren & { className?: string };

const AlertHeading = forwardRef<
  ComponentRef<typeof Heading>,
  AlertHeadingProps
>(({ className, children, ...rest }, ref) => {
  return (
    <Heading
      ref={ref}
      size="md"
      className={twMerge('mb-2', className)}
    >
      {children}
    </Heading>
  );
});

const AlertDescription = forwardRef<VStackRef, AlertDescriptionProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <VStack
        ref={ref}
        className={twMerge('mb-2', className)}
        {...rest}
      >
        {children}
      </VStack>
    );
  },
);

type AlertVariant = (typeof Variant)[number];

type AlertColorClasses = {
  root: string;
  text: string;
  // Border over the `outline` surface, in the color of the variant.
  outline: string;
  heading?: string;
  // Text over the `outline` surface, which inverts in dark mode: the `-600`
  // step, as in the Button outline, since `-800` is almost black over it.
  outlineText: string;
};

// The v5 primitive only distinguishes default/destructive; every semantic
// color is set through classes over `default`, following the Badge colors
// (`-100` background, `-700` text) with a `-300` border, visible over the
// tinted background. The scales invert in dark mode, so the same classes keep
// the contrast without `dark:`. `primary` uses the solid fill of the Button
// (`-500` with `typography-0` text and heading), like Badge. `light` and
// `dark` use the fixed surfaces of the theme, which keep their color in dark
// mode; `dark` also colors the heading, whose default `foreground` would not
// contrast with it. `neutral`, the default, uses the neutral scales.
const COLOR_CLASSES: Record<AlertVariant, AlertColorClasses> = {
  primary: {
    root: 'bg-primary-500 border-primary-500',
    text: 'text-typography-0',
    heading: 'text-typography-0',
    outline: 'border-primary-300',
    outlineText: 'text-primary-600',
  },
  secondary: {
    root: 'bg-secondary-100 border-secondary-300',
    text: 'text-secondary-700',
    outline: 'border-secondary-300',
    outlineText: 'text-secondary-600',
  },
  danger: {
    root: 'bg-error-100 border-error-300',
    text: 'text-error-700',
    outline: 'border-error-300',
    outlineText: 'text-error-600',
  },
  warning: {
    root: 'bg-warning-100 border-warning-300',
    text: 'text-warning-700',
    outline: 'border-warning-300',
    outlineText: 'text-warning-600',
  },
  success: {
    root: 'bg-success-100 border-success-300',
    text: 'text-success-700',
    outline: 'border-success-300',
    outlineText: 'text-success-600',
  },
  info: {
    root: 'bg-info-100 border-info-300',
    text: 'text-info-700',
    outline: 'border-info-300',
    outlineText: 'text-info-600',
  },
  light: {
    root: 'bg-fixed-light border-fixed-light-border',
    text: 'text-fixed-light-foreground',
    outline: 'border-outline-200',
    outlineText: 'text-typography-700',
  },
  dark: {
    root: 'bg-fixed-dark border-fixed-dark-hover',
    text: 'text-fixed-dark-foreground',
    outline: 'border-background-800',
    heading: 'text-fixed-dark-foreground',
    outlineText: 'text-typography-900',
  },
  neutral: {
    root: 'bg-background-100 border-outline-300',
    text: 'text-typography-700',
    outline: 'border-outline-300',
    outlineText: 'text-typography-800',
  },
};

// `solid` keeps the colored border of the recipes; `outline` replaces the
// tinted background with the base surface and keeps the color of the variant
// in its border and text.
const SOLID_CLASSES = 'border';

const OUTLINE_CLASSES = 'border bg-background-0';

const Alert = (props: AlertProps) => {
  const {
    variant = 'neutral',
    children,
    description,
    outline,
    className,
    dismissible,
    onClose,
    ...rest
  } = props;

  // A value outside the type (from untyped data) falls back to `neutral`.
  const {
    root,
    text,
    outline: outlineBorder,
    heading,
    outlineText,
  } = COLOR_CLASSES[variant] ?? COLOR_CLASSES.neutral;

  let textClassName = text;

  let headingClassName = heading;

  let shapeClassName = SOLID_CLASSES;

  if (outline) {
    shapeClassName = twMerge(OUTLINE_CLASSES, outlineBorder);

    textClassName = outlineText;

    headingClassName = undefined;
  }

  const newProps = {
    variant: 'default',
    ...rest,
    className: twMerge(root, shapeClassName, `mb-3 ${className}`),
  } as const;

  if (props.show === false) {
    return null;
  }

  // Native platforms only expose the alert role on an accessible element,
  // which merges its content into one announcement. Alerts with element
  // children may contain actions, so they keep their children reachable.
  // A dismissible alert keeps its close button reachable as well.
  // Text and numbers, also as several fragments (`{error} Reintenta.`),
  // render as one text block.
  const isText =
    children !== undefined &&
    Children.toArray(children).every(
      (child) => typeof child === 'string' || typeof child === 'number',
    );

  const isTextOnly = dismissible !== true && (children === undefined || isText);

  const renderChildren = () => {
    if (isText) {
      return <AlertText className={textClassName}>{children}</AlertText>;
    }

    return children;
  };

  return (
    <TheAlert
      accessible={isTextOnly}
      {...newProps}
    >
      <VStack className={twMerge('p-4', dismissible === true && 'flex-1')}>
        {props.title && (
          <AlertHeading className={headingClassName}>
            {props.title}
          </AlertHeading>
        )}
        {children && renderChildren()}
        {description && (
          <AlertDescription>
            {typeof description === 'string' && (
              <AlertText className={textClassName}>{description}</AlertText>
            )}
            {typeof description !== 'string' && description}
          </AlertDescription>
        )}
      </VStack>
      {dismissible === true && (
        <Pressable
          role="button"
          accessibilityLabel="Cerrar alerta"
          hitSlop={8}
          className="m-2 rounded p-2"
          onPress={(event) => onClose && onClose(event)}
        >
          <Icon
            as={CloseIcon}
            size="sm"
            className={textClassName}
          />
        </Pressable>
      )}
    </TheAlert>
  );
};

export default Object.assign(Alert, {
  Heading: AlertHeading,
  Description: AlertDescription,
});

export { Alert, AlertDescription, AlertHeading };
