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
];
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

type AlertColor = 'error' | 'warning' | 'success' | 'info' | 'muted';

// The v5 primitive only distinguishes default/destructive; every semantic
// color keeps the v3 `action` palette through classes over `default`.
const COLOR_CLASSES: Record<AlertColor, { root: string; text: string }> = {
  error: { root: 'bg-background-error', text: 'text-error-800' },
  warning: { root: 'bg-background-warning', text: 'text-warning-800' },
  success: { root: 'bg-background-success', text: 'text-success-800' },
  info: { root: 'bg-background-info', text: 'text-info-800' },
  muted: { root: 'bg-background-muted', text: 'text-background-800' },
};

// v3 `variant`: `solid` had no border; `outline` used the outline palette.
const SOLID_CLASSES = 'border-0';

const OUTLINE_CLASSES = 'border border-outline-100 bg-background-0';

const Alert = (props: AlertProps) => {
  const {
    variant,
    children,
    description,
    outline,
    className,
    dismissible,
    onClose,
    ...rest
  } = props;

  let color: AlertColor;

  let darkClassName = '';

  switch (variant) {
    case 'success':
    case 'warning':
    case 'info':
      color = variant;
      break;
    case 'danger':
      color = 'error';
      break;
    case 'dark':
      // Over the v3 default `muted` action.
      color = 'muted';
      darkClassName =
        'p-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300';
      break;
    default:
      // v3 defaulted `action` to `muted`.
      color = 'muted';
      break;
  }

  const textClassName = COLOR_CLASSES[color].text;

  let shapeClassName = SOLID_CLASSES;

  if (outline) {
    shapeClassName = OUTLINE_CLASSES;
  }

  const newProps = {
    variant: 'default',
    ...rest,
    className: twMerge(
      COLOR_CLASSES[color].root,
      shapeClassName,
      darkClassName,
      `mb-3 ${className}`,
    ),
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
        {props.title && <AlertHeading>{props.title}</AlertHeading>}
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
