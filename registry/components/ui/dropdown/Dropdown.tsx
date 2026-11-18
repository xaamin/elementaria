import React, {
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';

import { cn } from '@/components/cn';
import { useMounted } from '@/components/hooks/useMounted';
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
} from '@/components/z/menu';

import { Button } from '../button';
import DropdownDivider from './DropdownDivider';
import DropdownItem from './DropdownItem';
import type { DropdownItemProps } from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import DropdownToggle from './DropdownToggle';
import { MenuLayer } from './MenuLayer';
import type { FocusFirstItem } from './MenuLayer';

export interface DropdownProps {
  children: ReactElement[];
  placement?:
    | 'bottom'
    | 'top'
    | 'right'
    | 'left'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'
    | 'right top'
    | 'right bottom'
    | 'left top'
    | 'left bottom';
  flip?: boolean;
  focusFirstItemOnShow?: FocusFirstItem;
  show?: boolean;
  className?: string;
  textValue?: string;
  onSelect?: (event: unknown) => void;
  onToggle?: (event: unknown) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

type DropdownChildProps = Omit<DropdownItemProps, 'children'> & {
  children?: ReactNode;
};

const DropdownBase = (props: DropdownProps) => {
  const {
    children: propChildren,
    placement = 'bottom right',
    show,
    focusFirstItemOnShow = 'keyboard',
    ...rest
  } = props;

  const [visible, setVisible] = useState(show);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // With @gluestack-ui/core 5 an overlay first rendered open never unmounts
  // after closing (its exit animation no longer resets the overlay state), so
  // it is always mounted closed and opened after the first render.
  const mounted = useMounted();

  function handleOpen() {
    setIsMenuOpen(true);
    props.onOpen?.();
  }

  function handleClose() {
    setIsMenuOpen(false);
    props.onClose?.();
  }

  useEffect(() => {
    setVisible(show);
  }, [show]);

  const children = React.Children.toArray(propChildren).filter(
    (child): child is ReactElement<DropdownChildProps> =>
      isValidElement<DropdownChildProps>(child),
  );

  const newProps = {
    ...rest,
    className: cn('p-0', props.className),
    isOpen: visible,
    placement,
  };

  const element = children?.[0] ?? null;
  const newChildren = children[1];

  const items = React.Children.map(newChildren?.props.children, (child) => {
    if (!isValidElement<DropdownChildProps>(child)) {
      return null;
    }

    if (child.type === DropdownDivider || child.type === MenuSeparator) {
      return child;
    }

    let textValue = props.textValue;

    const newChildren = React.Children.map(child.props.children, (subchild) => {
      if (!textValue) {
        if (typeof subchild === 'string') {
          textValue = subchild;
        } else if (
          isValidElement<{ children?: ReactNode }>(subchild) &&
          typeof subchild.props.children === 'string'
        ) {
          textValue = subchild.props.children;
        }
      }

      return typeof subchild === 'string' ? (
        <MenuItemLabel>{subchild}</MenuItemLabel>
      ) : (
        subchild
      );
    });

    const { size: itemSize, ...rest } = child.props;

    const newProps = {
      ...rest,
      anchor: !!rest.href,
      className: cn(
        'px-4 gap-4',
        {
          'py-2': itemSize === 'sm',
          'py-4': itemSize === 'md',
          'py-6': itemSize === 'lg',
          'py-8': itemSize === 'xl',
        },
        rest.className,
      ),
      textValue,
      children: newChildren,
    };

    return <MenuItem {...newProps} />;
  });

  const isLayerOpen = visible ?? isMenuOpen;

  return (
    <MenuLayer
      isOpen={isLayerOpen}
      focusFirstItem={focusFirstItemOnShow}
    >
      {(isReady) => (
        <Menu
          offset={5}
          {...newProps}
          trigger={({ ...triggerProps }) => {
            if (!element) {
              return <></>;
            }

            if (element.type === DropdownToggle) {
              return (
                <Button
                  size="sm"
                  variant="light"
                  {...triggerProps}
                  {...element.props}
                />
              );
            }

            const newChildren = React.Children.map(
              element.props.children ?? [],
              (child) => {
                if (
                  isValidElement<DropdownChildProps>(child) &&
                  child.type === DropdownToggle
                ) {
                  return (
                    <Button
                      size="sm"
                      {...triggerProps}
                      {...child.props}
                    />
                  );
                }

                return child;
              },
            );

            return React.cloneElement(element, {
              children: newChildren,
            });
          }}
          {...rest}
          onOpen={handleOpen}
          onClose={handleClose}
          isOpen={mounted && isReady}
        >
          {items}
        </Menu>
      )}
    </MenuLayer>
  );
};

export { DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle };

const Dropdown = Object.assign(DropdownBase, {
  Toggle: DropdownToggle,
  Menu: DropdownMenu,
  Item: DropdownItem,
  Divider: DropdownDivider,
});

export default Dropdown;
