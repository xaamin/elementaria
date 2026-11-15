import type {
  ComponentProps,
  ComponentRef,
  PropsWithChildren,
  RefAttributes,
} from 'react';
import type { Pressable, ScrollView, View } from 'react-native';

import { useMounted } from '@/components/hooks/useMounted';
import {
  DrawerBackdrop,
  DrawerBody as TheDrawerBody,
  DrawerCloseButton as TheDrawerCloseButton,
  DrawerContent,
  DrawerFooter as TheDrawerFooter,
  DrawerHeader as TheDrawerHeader,
  Drawer as TheDrawer,
} from '@/components/z/drawer';

import {
  MENU_LAYER_DIALOG,
  MenuLayerContext,
} from '../dropdown/menuLayerContext';
import { withFrozenProps } from '../primitive';

export interface DrawerProps {
  isOpen: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  onClose: () => void;
  children?: React.ReactNode;
}

export type DrawerHeaderProps = ComponentProps<typeof View> &
  RefAttributes<ComponentRef<typeof View>>;
export type DrawerBodyProps = ComponentProps<typeof ScrollView>;
export type DrawerFooterProps = ComponentProps<typeof View> &
  RefAttributes<ComponentRef<typeof View>>;
export type DrawerCloseProps = ComponentProps<typeof Pressable>;

const DrawerRoot = withFrozenProps<DrawerProps, 'size'>(TheDrawer);

const DrawerHeader = withFrozenProps<DrawerHeaderProps>(TheDrawerHeader);

const DrawerBody = withFrozenProps<DrawerBodyProps>(TheDrawerBody);

const DrawerFooter = withFrozenProps<DrawerFooterProps>(TheDrawerFooter);

const DrawerCloseButton =
  withFrozenProps<DrawerCloseProps>(TheDrawerCloseButton);

type DrawerAnchor = NonNullable<DrawerProps['anchor']>;

// The template only sizes sm, md, lg and full; `xs` and `xl` extend its scale
// (sm: 2/5 -> 1/4 width or 1/4 height, lg: 3/4) for each anchor.
const EXTRA_SIZE_CLASSES: Record<'xs' | 'xl', Record<DrawerAnchor, string>> = {
  xs: {
    left: 'w-1/3 sm:w-1/5',
    right: 'w-1/3 sm:w-1/5',
    top: 'h-1/5',
    bottom: 'h-1/5',
  },
  xl: {
    left: 'w-5/6',
    right: 'w-5/6',
    top: 'h-5/6',
    bottom: 'h-5/6',
  },
};

const BaseDrawer = ({
  size,
  anchor,
  isOpen,
  onClose,
  children,
}: PropsWithChildren<DrawerProps>) => {
  // With @gluestack-ui/core 5 an overlay first rendered open never unmounts
  // after closing (its exit animation no longer resets the overlay state), so
  // it is always mounted closed and opened after the first render.
  const mounted = useMounted();

  let contentClassName: string | undefined;

  if (size === 'xs' || size === 'xl') {
    contentClassName = EXTRA_SIZE_CLASSES[size][anchor ?? 'left'];
  }

  return (
    <DrawerRoot
      size={size}
      anchor={anchor}
      isOpen={mounted && isOpen}
      onClose={onClose}
    >
      <DrawerBackdrop />
      <DrawerContent className={contentClassName}>
        <MenuLayerContext.Provider value={MENU_LAYER_DIALOG}>
          {children}
        </MenuLayerContext.Provider>
      </DrawerContent>
    </DrawerRoot>
  );
};

const Drawer = Object.assign(BaseDrawer, {
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Close: DrawerCloseButton,
});

const DrawerClose = DrawerCloseButton;

export { Drawer, DrawerBody, DrawerClose, DrawerFooter, DrawerHeader };
