import React, {
  ComponentProps,
  ComponentRef,
  PropsWithChildren,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import type { ScrollView, View } from 'react-native';

import { cn } from '@/components/cn';
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

import {
  MENU_LAYER_DIALOG,
  MenuLayerContext,
} from '../dropdown/menuLayerContext';
import { Heading, type HeadingProps } from '../heading';
import { Pressable } from '../pressable';
import { withFrozenProps } from '../primitive';

export type ModalProps = PropsWithChildren & {
  animation?: boolean;
  autoFocus?: boolean;
  backdrop?: 'static' | boolean;
  isOpen?: boolean;
  responsive?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  closable?: boolean;
  contentClassName?: string;
  dialogClassName?: string;
  enforceFocus?: boolean;
  fullscreen?:
    true | 'sm-down' | 'md-down' | 'lg-down' | 'xl-down' | 'xxl-down';
  manager?: object;
  scrollable?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onEnter?: (event?: unknown) => void;
  onEntered?: (event?: unknown) => void;
  onEscapeKeyDown?: (event?: unknown) => void;
  onExit?: (event?: unknown) => void;
  onExited?: (event?: unknown) => void;
  onExiting?: (event?: unknown) => void;
  onHide?: (event?: unknown) => void;
  onShow?: (event?: unknown) => void;
  onClose?: (event?: unknown) => void;
};

type ModalRootProps = Omit<ModalProps, 'backdrop'> & {
  backdrop?: boolean;
} & React.RefAttributes<React.ComponentRef<typeof TheModal>>;

const ModalRoot = withFrozenProps<ModalRootProps, 'size'>(TheModal);

// The template only sizes xs..lg and full; `xl` continues its scale here.
const XL_CONTENT_CLASS_NAME = 'w-[95%] max-w-[800px]';

const ModalBase = forwardRef<React.ComponentRef<typeof TheModal>, ModalProps>(
  (props, ref) => {
    const [isOpen, setIsOpen] = useState(() => props.isOpen === true);
    const {
      children,
      isOpen: show = false,
      responsive,
      backdrop = true,
      closable = false,
      ...rest
    } = props;

    const mounted = useMounted();

    useEffect(() => {
      if (show !== isOpen) {
        setIsOpen(show);
      }
    }, [show]);

    const handleClose = () => {
      setIsOpen(false);

      props.onClose && props.onClose();
    };

    // With @gluestack-ui/core 5 an overlay first rendered open never unmounts
    // after closing (its exit animation no longer resets the overlay state), so
    // it is always mounted closed and opened after the first render.
    const newProps = {
      ...rest,
      isOpen: mounted && isOpen,
      responsive: responsive,
      backdrop: backdrop === true,
      onClose: handleClose,
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

    return (
      <ModalRoot
        {...newProps}
        ref={ref}
      >
        {backdrop && <ModalBackdrop />}

        <ModalContent
          className={props.size === 'xl' ? XL_CONTENT_CLASS_NAME : undefined}
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
  onClose?: () => void;
};

const ModalHeader = (props: ModalHeaderProps) => {
  const { closable, ...rest } = props;

  const handleClose = () => {
    props.onClose && props.onClose();
  };
  return (
    <ModalHeading {...rest}>
      {typeof props.children === 'string' && (
        <ModalTitle>{props.children}</ModalTitle>
      )}

      {typeof props.children !== 'string' && props.children}

      {closable && (
        <Pressable
          onPress={handleClose}
          className="z-10 flex flex-row justify-end"
        >
          <ModalCloseButton accessibilityLabel="Cerrar">
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </Pressable>
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
  React.RefAttributes<ScrollView>;

const ScrollableModalBody = TheModalBody as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<ModalBodyProps> & React.RefAttributes<ScrollView>
>;

const ModalBody = forwardRef<ScrollView, ModalBodyProps>((props, ref) => {
  return (
    <ScrollableModalBody
      {...props}
      ref={ref}
      className={cn('mb-0', props.className)}
    />
  );
});

export type ModalActionsProps = ModalSectionProps;
export type ModalFooterProps = ModalActionsProps;

const ModalActions = (props: ModalActionsProps) => {
  const { className, ...rest } = props;

  return (
    <ModalFooter
      {...rest}
      className={cn('pt-6 pb-0', className)}
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
