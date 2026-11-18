import type { ComponentPropsWithoutRef, FormEvent } from 'react';
import { Platform } from 'react-native';

import { cn } from '@/components/cn';
import { VStack } from '@/components/ui/vstack';
import type { VStackProps } from '@/components/ui/vstack';

import { Check } from './Check';
import { Checkbox } from './Checkbox';
import { DateInput } from './DateInput';
import { Group } from './Group';
import { HelperText } from './HelperText';
import { Input } from './Input';
import { Label } from './Label';
import { Radio } from './Radio';
import { Select } from './Select';
import { Textarea } from './Textarea';

const noOp = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

export type FormProps =
  ComponentPropsWithoutRef<'form'> | Omit<VStackProps, 'ref'>;

const FormWrapper = (props: FormProps) => {
  const { className, ...rest } = props;

  return (
    <VStack className="flex-1">
      {Platform.OS === 'web' && (
        <form
          onSubmit={noOp}
          {...(rest as ComponentPropsWithoutRef<'form'>)}
          className={cn('flex flex-1 flex-col gap-4', className)}
        />
      )}
      {Platform.OS !== 'web' && (
        <VStack
          {...(rest as Omit<VStackProps, 'ref'>)}
          className={cn('flex flex-1 flex-col gap-4', className)}
        />
      )}
    </VStack>
  );
};

const Form = Object.assign(FormWrapper, {
  Checkbox,
  Select,
  Group,
  Label,
  Input,
  Check,
  DateInput,
  Radio,
  HelperText,
  Textarea,
});

export {
  Check,
  Checkbox,
  DateInput,
  Form,
  Group,
  HelperText,
  Input,
  Label,
  Radio,
  Select,
  Textarea,
};

export type { CheckProps } from './Check';
export type { CheckboxProps } from './Checkbox';
export type { DateInputProps } from './DateInput.types';
export type { ErrorItem, ErrorProps } from './Error';
export type { FileInputAsset, FileInputProps } from './FileInput';
export type {
  AutocompleteSuggestion,
  FixedAutocompleteProps,
} from './FixedAutocomplete';
export type { GroupProps } from './Group';
export type { HelperTextProps } from './HelperText';
export type {
  InputFieldProps,
  InputProps,
  InputRef,
  InputTextProps,
} from './Input';
export type { InputWrapperProps } from './InputWrapper';
export type { LabelProps } from './Label';
export type { RadioProps } from './Radio';
export type { SearchBoxProps } from './SearchBox';
export type { SelectOption, SelectProps } from './Select';
export type { FormTextProps } from './Text';
export type { TextareaProps } from './Textarea';
