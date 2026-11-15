import { useEffect, useRef } from 'react';
import type {
  ComponentProps,
  ComponentRef,
  PropsWithChildren,
  RefAttributes,
} from 'react';
import { Platform } from 'react-native';
import type { Pressable, ScrollView, View } from 'react-native';

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

const AlertDialogBody =
  withFrozenProps<AlertDialogBodyProps>(TheAlertDialogBody);

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
  const ignoreEscapeRef = useRef(false);

  // With @gluestack-ui/core 5 an overlay first rendered open never unmounts
  // after closing (its exit animation no longer resets the overlay state), so
  // it is always mounted closed and opened after the first render.
  const mounted = useMounted();

  const keepOpenOnEscape =
    Platform.OS === 'web' && isOpen === true && isKeyboardDismissable === false;

  // On web the primitive listens for Escape even when keyboard dismissal is
  // disabled, so the close request caused by that key is ignored here.
  useEffect(() => {
    if (!keepOpenOnEscape) {
      return;
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      ignoreEscapeRef.current = true;

      setTimeout(() => {
        ignoreEscapeRef.current = false;
      }, 0);
    };

    window.addEventListener('keyup', handleKeyUp, true);

    return () => {
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [keepOpenOnEscape]);

  const handleClose = () => {
    if (ignoreEscapeRef.current) {
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
