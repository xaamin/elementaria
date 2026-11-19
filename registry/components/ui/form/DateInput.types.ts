import type { InputWrapperProps } from './InputWrapper';

export interface DateInputProps extends Omit<
  InputWrapperProps,
  'children' | 'helperText'
> {
  value?: string;
  onChangeText?: (value: string) => void;
  disabled?: boolean;
  readonly?: boolean;
  accessibilityLabel?: string;
  inputClassName?: string;
  presentation?: 'modal' | 'auto';
  showPanelLabel?: boolean;
  /** First selectable day (`AAAA-MM-DD`, inclusive); invalid values are ignored. */
  minDate?: string;
  /** Last selectable day (`AAAA-MM-DD`, inclusive); invalid values are ignored. */
  maxDate?: string;
  /** Makes the month title open year and month grids. */
  allowYearNavigation?: boolean;
}
