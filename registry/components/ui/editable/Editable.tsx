import { Check, PencilIcon, X } from 'lucide-react-native';
import { ReactNode, useEffect, useState } from 'react';

import { Button } from '../button';
import type { InputTextProps } from '../form';
import { FormControl } from '../form-control';
import { HStack } from '../hstack';
import { Pressable } from '../pressable';
import { Text } from '../text';
import { VStack } from '../vstack';

export interface EditableProps {
  label: ReactNode;
  value?: string | number;
  required?: boolean;
  type?: InputTextProps['type'];
  placeholder?: ReactNode;
  onSave: (value: string) => void;
  validate?: (value: string) => string | void;
}

const Editable = ({
  label,
  value: initialValue,
  onSave,
  validate,
  required = false,
  type = 'text',
  placeholder = 'Escribe un valor...',
  ...inputProps
}: EditableProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<string>(`${initialValue ?? ''}`);
  const [error, setError] = useState('');

  useEffect(() => {
    if (value !== undefined) {
      const validationError = validateField(value);

      if (validationError) {
        setError(validationError);
      } else {
        setError('');
      }
    }
  }, [value]);

  const handleEdit = () => {
    setError(validateField(value) || '');
    setIsEditing(true);
  };

  const validateField = (value: string) => {
    if (required && !value.trim()) {
      return 'Este campo es obligatorio';
    }

    if (validate) {
      return validate(value);
    }

    return '';
  };

  const handleSave = () => {
    const validationError = validateField(value);

    if (validationError) {
      setError(validationError);

      return;
    }

    setIsEditing(false);
    setError('');
    onSave(value);
  };

  const handleCancel = () => {
    setValue(`${initialValue ?? ''}`);
    setIsEditing(false);
    setError('');
  };

  const handlevalueChange = (newValue: string) => {
    setValue(newValue);

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleKeyPress: NonNullable<InputTextProps['onKeyPress']> = (e) => {
    if (e.nativeEvent.key === 'Enter' && !error) {
      handleSave();
    }
    if (e.nativeEvent.key === 'Escape') {
      handleCancel();
    }
  };

  const labelDisplay = label || placeholder;

  return (
    <>
      {isEditing && (
        <HStack className="gap-2 grow">
          <VStack className="grow">
            <FormControl
              inputClassName="h-14"
              size="lg"
              value={value}
              onChangeText={handlevalueChange}
              placeholder={
                typeof placeholder === 'string' ? placeholder : undefined
              }
              autoFocus
              type={type}
              error={error}
              isFieldDirty={value !== undefined}
              onKeyPress={handleKeyPress}
              accessibilityLabel={typeof label === 'string' ? label : undefined}
              {...inputProps}
            />
          </VStack>

          <HStack className="gap-2">
            <Button
              variant="primary"
              disabled={!!error}
              accessibilityLabel="Guardar"
              onPress={handleSave}
            >
              <Check
                size={16}
                color="white"
              />
            </Button>
            <Button
              variant="secondary"
              accessibilityLabel="Cancelar"
              onPress={handleCancel}
            >
              <X size={16} />
            </Button>
          </HStack>
        </HStack>
      )}

      {!isEditing && (
        <Pressable
          accessibilityRole="button"
          onPress={handleEdit}
        >
          <HStack className="items-center gap-2">
            <HStack>
              {typeof labelDisplay === 'string' ? (
                <Text className="font-medium">{labelDisplay}</Text>
              ) : (
                labelDisplay
              )}
            </HStack>
            <PencilIcon
              size={16}
              className="text-background-300 hover:text-background-700"
            />
          </HStack>
        </Pressable>
      )}
    </>
  );
};

export { Editable };
