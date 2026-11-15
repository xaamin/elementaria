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
}
