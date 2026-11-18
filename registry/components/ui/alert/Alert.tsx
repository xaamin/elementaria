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
import {
  isToneVariant,
  OUTLINE_CLASSES,
  SOFT_CLASSES,
  SOLID_CLASSES,
} from '../variants';
import type { ToneClasses } from '../variants';
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

// The v5 primitive only distinguishes default/destructive; every semantic
// color is set through classes over `default`, from the shared variant
// recipes: the soft recipe, except `primary`, which uses the solid fill. The
// heading keeps its default `foreground` over tinted surfaces; over the solid
// fill and the fixed `dark` surface it takes the text color to contrast.
function surfaceClasses(variant: AlertVariant): ToneClasses & {
  heading?: string;
} {
  if (variant === 'primary') {
    return { ...SOLID_CLASSES.primary, heading: SOLID_CLASSES.primary.text };
  }

  if (variant === 'dark') {
    return { ...SOFT_CLASSES.dark, heading: SOFT_CLASSES.dark.text };
  }

  return SOFT_CLASSES[variant];
}

// `solid` always shows the border of the recipe; `outline` replaces the
// background with the base surface and keeps the color of the variant in its
// border and text.
const SOLID_SHAPE_CLASSES = 'border';

const OUTLINE_SHAPE_CLASSES = 'border bg-background-0';

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
  let alertVariant: AlertVariant = 'neutral';

  if (isToneVariant(variant)) {
    alertVariant = variant;
  }

  const { root, text, heading } = surfaceClasses(alertVariant);

  let textClassName = text;

  let headingClassName = heading;

  let shapeClassName = SOLID_SHAPE_CLASSES;

  if (outline) {
    shapeClassName = twMerge(
      OUTLINE_SHAPE_CLASSES,
      OUTLINE_CLASSES[alertVariant].border,
    );

    textClassName = OUTLINE_CLASSES[alertVariant].text;

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
