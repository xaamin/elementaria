import { ElementType, PropsWithChildren, ReactNode } from 'react';

import { MenuItem } from '@/components/z/menu';

export interface DropdownItemProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  active?: boolean;
  as?: ElementType;
  disabled?: boolean;
  eventKey?: string | number;
  onClick?: (event: any) => void;
  onSelect?: (event: any) => void;
  href?: string;
  className?: string;
  onPress?: () => void;
  closeOnSelect?: boolean;
}

const DropdownItem = (props: PropsWithChildren<DropdownItemProps>) => {
  return <MenuItem {...props} />;
};

export default DropdownItem;
