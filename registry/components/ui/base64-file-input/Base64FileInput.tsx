import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { CloudUploadIcon, XIcon } from 'lucide-react-native';
import type { ComponentType, ReactNode } from 'react';
import { useState } from 'react';
import { Platform } from 'react-native';

import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { HStack } from '../hstack';

export type Base64FileValue = {
  size: number;
  type: string;
  name: string;
  content: string;
};

export type Base64FileChange = {
  name?: string;
  filename: string;
  value: Base64FileValue;
};

export type Base64FileInputProps = {
  name?: string;
  accept?: string;
  multiple?: boolean;
  label?: ReactNode;
  placeholder?: ReactNode;
  value?: Pick<Base64FileChange, 'filename'> | null;
  showFileName?: boolean;
  icon?: ComponentType;
  children?: ReactNode;
  onError?: (error: Error) => void;
  onChange: (value: Base64FileChange | Base64FileChange[] | null) => void;
};

function getPickerType(accept?: string): string | string[] {
  const acceptedTypes = accept
    ?.split(',')
    .map((type) => type.trim())
    .filter(Boolean);

  if (!acceptedTypes?.length || acceptedTypes.includes('*')) {
    return '*/*';
  }
  if (Platform.OS === 'web') {
    return accept ?? '*/*';
  }
  if (acceptedTypes.some((type) => !type.includes('/'))) {
    return '*/*';
  }

  return acceptedTypes;
}

function matchesAccept(
  asset: DocumentPicker.DocumentPickerAsset,
  accept?: string,
): boolean {
  if (!accept || accept.trim() === '*') {
    return true;
  }

  return accept
    .split(/[\s,]+/)
    .filter(Boolean)
    .some((type) => {
      if (type === '*/*') {
        return true;
      }
      if (type.startsWith('.')) {
        return asset.name.toLowerCase().endsWith(type.toLowerCase());
      }

      const [category, subtype] = type.split('/');

      if (!category || !subtype || !asset.mimeType) {
        return false;
      }
      if (subtype === '*') {
        return asset.mimeType.startsWith(`${category}/`);
      }

      return asset.mimeType === type;
    });
}

function Base64FileInput(props: Base64FileInputProps) {
  const {
    name,
    accept,
    multiple,
    label,
    placeholder,
    value,
    showFileName = true,
    icon: Icon,
    children,
    onError,
    onChange,
  } = props;
  const [selectionError, setSelectionError] = useState<string>();
  const filename = value?.filename;

  async function handlePress() {
    handleClear();

    try {
      const selection = await DocumentPicker.getDocumentAsync({
        type: getPickerType(accept),
        multiple,
        copyToCacheDirectory: true,
        base64: true,
      });

      if (selection.canceled) {
        return;
      }

      const rejectedAsset = selection.assets.find(
        (asset) => !matchesAccept(asset, accept),
      );

      if (rejectedAsset) {
        const error = new Error(
          `El archivo ${rejectedAsset.name} no coincide con los formatos aceptados.`,
        );
        setSelectionError(error.message);
        onError?.(error);
        return;
      }

      const selectedFiles = await Promise.all(
        selection.assets.map(async (asset) => {
          const content = asset.base64 ?? (await new File(asset.uri).base64());

          return {
            name,
            filename: multiple
              ? `${selection.assets.length} files`
              : asset.name,
            value: {
              size: asset.size ?? 0,
              type: asset.mimeType ?? '',
              name: asset.name,
              content,
            },
          } satisfies Base64FileChange;
        }),
      );

      onChange(multiple ? selectedFiles : selectedFiles[0]);
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));
      setSelectionError('No se pudo seleccionar o leer el archivo.');
      onError?.(normalizedError);
    }
  }

  function handleClear() {
    setSelectionError(undefined);
    onChange(multiple ? [] : null);
  }

  function renderContent(
    content: ReactNode,
    className?: string,
    key?: React.Key,
  ) {
    if (typeof content === 'string' || typeof content === 'number') {
      return (
        <Text
          key={key}
          className={className}
        >
          {content}
        </Text>
      );
    }

    return content;
  }

  const isMultiple = multiple && Array.isArray(value) && value.length > 0;

  return (
    <VStack className="gap-2">
      <HStack className="flex-row items-center gap-2">
        <Pressable
          accessibilityRole="button"
          onPress={handlePress}
          className="min-w-0 flex-row items-center gap-3 rounded-md border border-dashed border-outline-300 p-4 px-6"
        >
          {Icon ? <Icon /> : <CloudUploadIcon size={20} />}
          <Box className="flex-1">
            {renderContent(label, 'font-medium')}
            {renderContent(children)}
          </Box>
        </Pressable>

        {!filename &&
          !multiple &&
          renderContent(placeholder, 'text-md text-typography-500')}

        {showFileName && filename && (
          <Text className="text-sm">{filename}</Text>
        )}

        {!!filename && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Eliminar archivo ${filename}`}
            onPress={handleClear}
            className="p-2"
          >
            <XIcon size={16} />
          </Pressable>
        )}

        {isMultiple &&
          renderContent(
            `${value.length} archivos seleccionados`,
            'text-md text-typography-500',
          )}
      </HStack>

      {isMultiple &&
        value.map((file, index) =>
          renderContent(file.filename, 'text-md text-typography-500', index),
        )}
      {selectionError && (
        <Text className="text-error-600">{selectionError}</Text>
      )}
    </VStack>
  );
}

export { Base64FileInput };
