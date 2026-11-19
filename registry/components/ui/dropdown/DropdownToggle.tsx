import type { ButtonProps, ButtonVariant } from '../button';

/** Alias de `ButtonVariant`, que el toggle acepta tal cual. */
export type ComponentColor = ButtonVariant;

export interface DropdownToggleProps extends ButtonProps {
  id?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const DropdownToggle = (props: DropdownToggleProps) => {
  const { children } = props;

  return children;
};

export default DropdownToggle;
