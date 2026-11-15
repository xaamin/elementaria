import React, {
  ElementType,
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

const Positions = ['up', 'left', 'right', 'down'];

const Horizontal = ['left', 'right'];

const Vertical = ['top', 'bottom'];
export interface DropdownProps {
  children: ReactElement[];
  as?: ElementType;
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
  drop?: (typeof Positions)[number];
  horizontal?: (typeof Horizontal)[number];
  vertical?: (typeof Vertical)[number];
  flip?: boolean;
  focusFirstItemOnShow?: false | true | 'keyboard';
  navbar?: boolean;
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
  drop?: string;
};

type DropdownPlacement = NonNullable<DropdownProps['placement']>;

type PlacementSide = 'top' | 'bottom' | 'left' | 'right';

const DEFAULT_PLACEMENT: DropdownPlacement = 'bottom right';

const DROP_SIDES: Record<string, PlacementSide> = {
  up: 'top',
  down: 'bottom',
  left: 'left',
  right: 'right',
};

/**
 * Resuelve la posicion del menu. `placement` explicito tiene prioridad; si no
 * se indica, `drop` (o `vertical`) elige el lado y `horizontal` (o `vertical`
 * en los lados izquierdo y derecho) la alineacion. Sin ninguno se usa
 * `'bottom right'`.
 */
function resolvePlacement(
  placement: DropdownPlacement | undefined,
  drop: string | undefined,
  horizontal: string | undefined,
  vertical: string | undefined,
): DropdownPlacement {
  if (placement) {
    return placement;
  }

  let side: PlacementSide = 'bottom';

  if (drop && DROP_SIDES[drop]) {
    side = DROP_SIDES[drop];
  } else if (vertical === 'top' || vertical === 'bottom') {
    side = vertical;
  } else if (!horizontal) {
    return DEFAULT_PLACEMENT;
  }

  if (side === 'left' || side === 'right') {
    if (vertical === 'top' || vertical === 'bottom') {
      return `${side} ${vertical}`;
    }

    return side;
  }

  if (horizontal === 'left') {
    return `${side} left`;
  }

  return `${side} right`;
}

const DropdownBase = (props: DropdownProps) => {
  const {
    children: propChildren,
    placement: placementProp,
    drop,
    show,
    horizontal: horizontalProp,
    vertical: verticalProp,
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

  // The v4 menu root is a ScrollView, whose boolean `horizontal` must not
  // receive the dropdown alignment: the legacy props only resolve `placement`.
  const placement = resolvePlacement(
    placementProp,
    drop ?? children[0]?.props.drop,
    horizontalProp,
    verticalProp,
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
    <MenuLayer isOpen={isLayerOpen}>
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
