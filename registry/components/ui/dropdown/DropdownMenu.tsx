import React, { ElementType, PropsWithChildren } from 'react';

export interface DropdownMenuProps {
  align?:
    | 'left'
    | 'right'
    | { sm: 'left' | 'right' }
    | { md: 'left' | 'right' }
    | { lg: 'left' | 'right' }
    | { xl: 'left' | 'right' };
  alignRight?: boolean;
  as?: ElementType;
  flip?: boolean;
  onSelect?: (event: unknown) => void;
  popperConfig?: object;
  renderOnMount?: boolean;
  rootCloseEvent?: 'click' | 'mousedown';
  show?: boolean;
  className?: string;
}

const DropdownMenu = (props: PropsWithChildren<DropdownMenuProps>) => {
  const { children } = props;

  return <>{children}</>;
};

export default DropdownMenu;
