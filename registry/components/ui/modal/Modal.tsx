import React, {
  ComponentProps,
  ComponentRef,
  PropsWithChildren,
  RefObject,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import type { ScrollView, ScrollViewInstance, View } from 'react-native';

import { cn } from '@/components/cn';
import { useEscapeCloseGuard } from '@/components/hooks/useEscapeCloseGuard';
import { useMounted } from '@/components/hooks/useMounted';
import { CloseIcon, Icon } from '@/components/z/icon';
import {
  ModalBackdrop,
  ModalCloseButton,
  ModalContent,
  ModalFooter as TheModalFooter,
  ModalHeader as TheModalHeading,
  Modal as TheModal,
  ModalBody as TheModalBody,
} from '@/components/z/modal';

import { Box } from '../box';
import {
  MENU_LAYER_DIALOG,
  MenuLayerContext,
} from '../dropdown/menuLayerContext';
import { Heading, type HeadingProps } from '../heading';
import { withFrozenProps } from '../primitive';

export type ModalProps = PropsWithChildren & {
  isOpen?: boolean;
  onClose?: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  backdrop?: boolean;
  closable?: boolean;
  avoidKeyboard?: boolean;
  closeOnOverlayClick?: boolean;
  isKeyboardDismissable?: boolean;
  initialFocusRef?: RefObject<unknown>;
  finalFocusRef?: RefObject<unknown>;
};

type ModalRootProps = Omit<ModalProps, 'className' | 'backdrop' | 'closable'> &
  React.RefAttributes<ComponentRef<typeof View>>;

const ModalRoot = withFrozenProps<ModalRootProps, 'size'>(TheModal);

// The template only sizes xs..lg and full; `xl` continues its scale here.
const XL_CONTENT_CLASS_NAME = 'w-[95%] max-w-[800px]';

const ModalBase = forwardRef<ComponentRef<typeof View>, ModalProps>(
  (props, ref) => {
    const [isOpen, setIsOpen] = useState(() => props.isOpen === true);
    const {
      children,
      isOpen: show = false,
      onClose,
      className,
      backdrop = true,
      closable = false,
      isKeyboardDismissable,
      ...rest
    } = props;

    const mounted = useMounted();

    const isEscapeClose = useEscapeCloseGuard(
      isOpen && isKeyboardDismissable === false,
    );

    useEffect(() => {
      if (show !== isOpen) {
        setIsOpen(show);
      }
    }, [show]);

    const handleClose = () => {
      if (isEscapeClose()) {
        return;
      }

      setIsOpen(false);

      onClose?.();
    };

    const newChildren = React.Children.map(children, (child) => {
      if (!React.isValidElement<ModalHeaderProps>(child)) {
        return null;
      }

      if (child.type !== ModalHeader) {
        return child;
      }

      return React.cloneElement(child, {
        closable,
      });
    });

    // With @gluestack-ui/core 5 an overlay first rendered open never unmounts
    // after closing (its exit animation no longer resets the overlay state), so
    // it is always mounted closed and opened after the first render.
    return (
      <ModalRoot
        {...rest}
        ref={ref}
        isOpen={mounted && isOpen}
        isKeyboardDismissable={isKeyboardDismissable}
        onClose={handleClose}
      >
        {backdrop && <ModalBackdrop />}

        <ModalContent
          className={cn(
            props.size === 'xl' && XL_CONTENT_CLASS_NAME,
            className,
          )}
        >
          <MenuLayerContext.Provider value={MENU_LAYER_DIALOG}>
            {newChildren}
          </MenuLayerContext.Provider>
        </ModalContent>
      </ModalRoot>
    );
  },
);

type ModalSectionProps = ComponentProps<typeof View> &
  React.RefAttributes<ComponentRef<typeof View>>;

const ModalHeading = withFrozenProps<ModalSectionProps>(TheModalHeading);

const ModalFooter = withFrozenProps<ModalSectionProps>(TheModalFooter);

export type ModalHeaderProps = ModalSectionProps & {
  closable?: boolean;
};

const ModalHeader = (props: ModalHeaderProps) => {
  const { closable, ...rest } = props;

  return (
    <ModalHeading {...rest}>
      {typeof props.children === 'string' && (
        <ModalTitle>{props.children}</ModalTitle>
      )}

      {typeof props.children !== 'string' && props.children}

      {closable && (
        <Box className="z-10 flex flex-row justify-end">
          <ModalCloseButton accessibilityLabel="Cerrar">
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </Box>
      )}
    </ModalHeading>
  );
};

export interface ModalTitleProps extends HeadingProps {}

const ModalTitle = (props: ModalTitleProps) => {
  const { className, ...rest } = props;

  return (
    <Heading
      size="md"
      className={cn('pb-2', className)}
      {...rest}
    />
  );
};

export type ModalBodyProps = Omit<ComponentProps<typeof ScrollView>, 'ref'> &
  React.RefAttributes<ScrollViewInstance>;

const ScrollableModalBody = TheModalBody as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<ModalBodyProps> &
    React.RefAttributes<ScrollViewInstance>
>;

const ModalBody = forwardRef<ScrollViewInstance, ModalBodyProps>(
  (props, ref) => {
    return (
      <ScrollableModalBody
        {...props}
        ref={ref}
        className={cn('my-0 py-4', props.className)}
      />
    );
  },
);

export type ModalActionsProps = ModalSectionProps;
export type ModalFooterProps = ModalActionsProps;

const ModalActions = (props: ModalActionsProps) => {
  const { className, ...rest } = props;

  return (
    <ModalFooter
      {...rest}
      className={className}
    />
  );
};

export { Modal, ModalActions, ModalBody, ModalHeader, ModalTitle };

const Modal = Object.assign(ModalBase, {
  Header: ModalHeader,
  Title: ModalTitle,
  Body: ModalBody,
  Footer: ModalActions,
});

export default Modal;
