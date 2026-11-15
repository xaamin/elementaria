import type { MotionComponentProps } from '@legendapp/motion';
import { forwardRef, useEffect, useMemo, useRef } from 'react';
import type {
  ComponentProps,
  ComponentRef,
  ReactNode,
  RefAttributes,
} from 'react';
import type { Text, View, ViewStyle } from 'react-native';

import {
  Tooltip as BaseTooltip,
  TooltipContent as BaseTooltipContent,
  TooltipText as BaseTooltipText,
} from '@/components/z/tooltip';

import { type TextVariantKeys, withFrozenProps } from '../primitive';
import { TooltipArrow } from './TooltipArrow';
import { DEFAULT_ARROW_SIZE, TooltipArrowContext } from './tooltipArrowContext';

export type TooltipProps = Omit<ComponentProps<typeof View>, 'children'> & {
  isDisabled?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  defaultIsOpen?: boolean;
  onOpen?: () => void;
  openDelay?: number;
  closeDelay?: number;
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'
    | 'right top'
    | 'right bottom'
    | 'left top'
    | 'left bottom';
  closeOnClick?: boolean;
  trigger: ({ ref, onHoverIn, onHoverOut }: any, { open }: any) => ReactNode;
  arrowSize?: number;
  hasArrow?: boolean;
  offset?: number;
  crossOffset?: number;
  shouldOverlapWithTrigger?: boolean;
  shouldFlip?: boolean;
  children: any;
  context?: any;
} & RefAttributes<ComponentRef<typeof View>>;

export type TooltipContentProps = ComponentProps<typeof View> &
  MotionComponentProps<typeof View, ViewStyle, unknown, unknown, unknown>;

export type TooltipTextProps = ComponentProps<typeof Text> & {
  size?: string | number;
  sub?: string | number | boolean;
  underline?: string | number | boolean;
  italic?: string | number | boolean;
  isTruncated?: string | number | boolean;
  bold?: string | number | boolean;
  strikeThrough?: string | number | boolean;
  highlight?: string | number | boolean;
};

const TooltipPrimitive = withFrozenProps<TooltipProps>(BaseTooltip);

/**
 * `@gluestack-ui/core` 5 programa un cierre al pulsar y otro al soltar sin
 * cancelar el anterior, y notifica cada cambio aunque el estado no varíe.
 * Este contenedor informa `onOpen` y `onClose` una sola vez por transición.
 */
const TooltipRoot = forwardRef<
  ComponentRef<typeof View>,
  Omit<TooltipProps, 'ref'>
>(function TooltipRoot(
  {
    onOpen,
    onClose,
    hasArrow = false,
    arrowSize = DEFAULT_ARROW_SIZE,
    children,
    ...props
  },
  ref,
) {
  const open = useRef(props.isOpen ?? props.defaultIsOpen ?? false);

  const placement = props.placement ?? 'bottom';

  const arrow = useMemo(
    () => ({ hasArrow, arrowSize, placement }),
    [hasArrow, arrowSize, placement],
  );

  useEffect(() => {
    if (props.isOpen !== undefined) {
      open.current = props.isOpen;
    }
  }, [props.isOpen]);

  const handleOpen = () => {
    if (open.current) {
      return;
    }

    open.current = true;

    onOpen?.();
  };

  const handleClose = () => {
    if (!open.current) {
      return;
    }

    open.current = false;

    onClose?.();
  };

  return (
    <TooltipPrimitive
      {...props}
      ref={ref}
      onOpen={handleOpen}
      onClose={handleClose}
    >
      <TooltipArrowContext.Provider value={arrow}>
        {children}
      </TooltipArrowContext.Provider>
    </TooltipPrimitive>
  );
});

const TooltipText = withFrozenProps<TooltipTextProps, TextVariantKeys>(
  BaseTooltipText,
);

const TooltipContentPrimitive =
  withFrozenProps<TooltipContentProps>(BaseTooltipContent);

const TooltipContent = ({ children, ...rest }: TooltipContentProps) => {
  return (
    <TooltipContentPrimitive {...rest}>
      {typeof children === 'string' ? (
        <TooltipText>{children}</TooltipText>
      ) : (
        children
      )}
      <TooltipArrow />
    </TooltipContentPrimitive>
  );
};

const Tooltip = Object.assign(TooltipRoot, {
  Content: TooltipContent,
  Text: TooltipText,
});

export { Tooltip };
