import { getDocumentAsync } from 'expo-document-picker';
import type { DocumentPickerAsset } from 'expo-document-picker';
import { CloudUploadIcon } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Platform } from 'react-native';

import { cn } from '@/components/cn';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';

import type { InputWrapperProps } from './InputWrapper';
import { InputWrapper } from './InputWrapper';

export type FileInputAsset = DocumentPickerAsset;

export type FileInputProps = InputWrapperProps & {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  onChange?: (files: FileInputAsset[]) => void;
  onError?: (error: Error) => void;
};

const FileInput = (props: FileInputProps) => {
  const {
    children,
    label,
    error,
    disabled,
    isInvalid,
    isRequired,
    required,
    isDisabled,
    isReadOnly,
    size,
    containerClassName,
    isFieldDirty,
    helperText,
    accept,
    multiple = false,
    className,
    placeholder = 'Seleccionar archivo',
    onChange,
    onError,
  } = props;

  const [files, setFiles] = useState<FileInputAsset[]>([]);
  const [selectionError, setSelectionError] = useState<string>();
  const [selecting, setSelecting] = useState(false);
  const pending = useRef(false);
  const blocked = disabled || isDisabled || isReadOnly || selecting;
  async function handlePress() {
    if (blocked || pending.current) {
      return;
    }

    pending.current = true;
    setSelecting(true);
    setSelectionError(undefined);

    try {
      const acceptedTypes =
        accept
          ?.split(',')
          .map((type) => type.trim())
          .filter(Boolean) ?? [];
      let type: string | string[] = '*/*';

      if (Platform.OS === 'web') {
        type = accept || '*/*';
      } else if (
        acceptedTypes.length &&
        acceptedTypes.every((item) => item.includes('/'))
      ) {
        type = acceptedTypes;
      }

      const selection = await getDocumentAsync({
        type,
        multiple,
        copyToCacheDirectory: true,
        base64: false,
      });

      if (selection.canceled) {
        return;
      }

      const rejected = selection.assets.find(
        (asset) =>
          acceptedTypes.length > 0 &&
          !acceptedTypes.some((item) => {
            if (item === '*' || item === '*/*') {
              return true;
            }

            if (item.startsWith('.')) {
              return asset.name.toLowerCase().endsWith(item.toLowerCase());
            }

            if (item.endsWith('/*')) {
              return asset.mimeType?.startsWith(item.slice(0, -1));
            }

            return asset.mimeType === item;
          }),
      );

      if (rejected) {
        throw new Error(
          `El archivo ${rejected.name} no coincide con los formatos aceptados.`,
        );
      }

      setFiles(selection.assets);
      onChange?.(selection.assets);
    } catch (caughtError) {
      const normalizedError =
        caughtError instanceof Error
          ? caughtError
          : new Error(String(caughtError));

      setSelectionError(normalizedError.message);
      onError?.(normalizedError);
    } finally {
      pending.current = false;
      setSelecting(false);
    }
  }

  return (
    <InputWrapper
      label={label}
      error={selectionError || error}
      isInvalid={!!selectionError || isInvalid}
      isRequired={isRequired || required}
      isDisabled={isDisabled || disabled}
      isReadOnly={isReadOnly}
      size={size}
      containerClassName={containerClassName}
      isFieldDirty={isFieldDirty}
      helperText={helperText}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={typeof label === 'string' ? label : placeholder}
        accessibilityState={{ disabled: !!blocked, busy: selecting }}
        disabled={!!blocked}
        onPress={handlePress}
        className={cn(
          'min-w-0 flex-row flex-wrap items-center gap-3 rounded-md border border-dashed border-outline-300 p-4',
          blocked && 'opacity-50',
          className,
        )}
      >
        <CloudUploadIcon
          size={20}
          color="currentColor"
        />
        <Text className="min-w-0 flex-1 text-typography-700">
          {files.length
            ? files.map((file) => file.name).join(', ')
            : placeholder}
        </Text>
      </Pressable>
      {children}
    </InputWrapper>
  );
};

export { FileInput };
