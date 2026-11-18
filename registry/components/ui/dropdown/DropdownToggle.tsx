import type { ButtonProps } from '../button';

const colors = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark',
  'outline',
];

export type ComponentColor = (typeof colors)[number];

export interface DropdownToggleProps extends ButtonProps {
  id?: string;
  variant?: ComponentColor;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const DropdownToggle = (props: DropdownToggleProps) => {
  const { children } = props;

  return children;
};

export default DropdownToggle;
