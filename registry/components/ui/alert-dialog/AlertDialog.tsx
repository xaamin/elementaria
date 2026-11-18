import { forwardRef } from 'react';
import type {
  ComponentProps,
  ComponentRef,
  PropsWithChildren,
  RefAttributes,
} from 'react';
import type {
  Pressable,
  ScrollView,
  ScrollViewInstance,
  View,
} from 'react-native';

import { cn } from '@/components/cn';
import { useEscapeCloseGuard } from '@/components/hooks/useEscapeCloseGuard';
import { useMounted } from '@/components/hooks/useMounted';
import {
  AlertDialogBackdrop,
  AlertDialogBody as TheAlertDialogBody,
  AlertDialogCloseButton as TheAlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter as TheAlertDialogFooter,
  AlertDialogHeader as TheAlertDialogHeader,
  AlertDialog as TheAlertDialog,
} from '@/components/z/alert-dialog';

import {
  MENU_LAYER_DIALOG,
  MenuLayerContext,
} from '../dropdown/menuLayerContext';
import { withFrozenProps } from '../primitive';

export interface AlertDialogProps {
  size?: string | number;
  isOpen?: boolean;
  className?: string;
  avoidKeyboard?: boolean;
  closeOnOverlayClick?: boolean;
  isKeyboardDismissable?: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export type AlertDialogHeaderProps = ComponentProps<typeof View> &
  RefAttributes<ComponentRef<typeof View>>;
export type AlertDialogBodyProps = ComponentProps<typeof ScrollView>;
export type AlertDialogFooterProps = ComponentProps<typeof View> &
  RefAttributes<ComponentRef<typeof View>>;
export type AlertDialogCloseProps = ComponentProps<typeof Pressable>;

const AlertDialogRoot = withFrozenProps<AlertDialogProps, 'size'>(
  TheAlertDialog,
);

const AlertDialogHeader =
  withFrozenProps<AlertDialogHeaderProps>(TheAlertDialogHeader);

const ScrollableAlertDialogBody =
  withFrozenProps<AlertDialogBodyProps>(TheAlertDialogBody);

const AlertDialogBody = forwardRef<ScrollViewInstance, AlertDialogBodyProps>(
  (props, ref) => {
    return (
      <ScrollableAlertDialogBody
        {...props}
        ref={ref}
        className={cn('py-4', props.className)}
      />
    );
  },
);

AlertDialogBody.displayName = 'AlertDialogBody';

const AlertDialogFooter =
  withFrozenProps<AlertDialogFooterProps>(TheAlertDialogFooter);

const AlertDialogCloseButton = withFrozenProps<AlertDialogCloseProps>(
  TheAlertDialogCloseButton,
);

const AlertDialog = ({
  isOpen,
  className,
  children,
  onClose,
  isKeyboardDismissable,
  ...rest
}: PropsWithChildren<AlertDialogProps>) => {
  // With @gluestack-ui/core 5 an overlay first rendered open never unmounts
  // after closing (its exit animation no longer resets the overlay state), so
  // it is always mounted closed and opened after the first render.
  const mounted = useMounted();

  const isEscapeClose = useEscapeCloseGuard(
    isOpen === true && isKeyboardDismissable === false,
  );

  const handleClose = () => {
    if (isEscapeClose()) {
      return;
    }

    onClose();
  };

  return (
    <AlertDialogRoot
      isOpen={mounted && isOpen === true}
      onClose={handleClose}
      isKeyboardDismissable={isKeyboardDismissable}
      {...rest}
      className="relative flex flex-1"
    >
      <AlertDialogBackdrop />
      <AlertDialogContent className={className}>
        <MenuLayerContext.Provider value={MENU_LAYER_DIALOG}>
          {children}
        </MenuLayerContext.Provider>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

const Header = AlertDialogHeader;
const Body = AlertDialogBody;
const Footer = AlertDialogFooter;

export { AlertDialog, Body, Footer, Header };

export default Object.assign(AlertDialog, {
  Header: AlertDialogHeader,
  Body: AlertDialogBody,
  Footer: AlertDialogFooter,
  Close: AlertDialogCloseButton,
});
