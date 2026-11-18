import { FilePlus2Icon } from 'lucide-react-native';
import type { ChangeEvent, ComponentPropsWithoutRef, ReactNode } from 'react';
import { useRef } from 'react';

import { cn } from '@/components/cn';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { UploadFileList } from './UploadFileList';
import type { UploadFileCollection } from './UploadFileList';

export interface FileUploaderProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'onChange' | 'value' | 'type' | 'children' | 'className' | 'style'
> {
  showSelectedFilesList?: boolean;
  label?: ReactNode;
  containerClassName?: string;
  files: UploadFileCollection;
  hideOnSelectFiles?: boolean;
  onChange: (files: File[]) => void;
  onDelete?: (index: number, file?: File) => void;
}

const FileUploader = ({
  showSelectedFilesList = true,
  label = 'Haz click para subir archivos',
  containerClassName,
  files,
  hideOnSelectFiles = false,
  onChange,
  onDelete,
  ...rest
}: FileUploaderProps) => {
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const accessibleName =
    typeof label === 'string' ? label : 'Seleccionar archivos';

  const handlePress = () => {
    hiddenFileInput.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const existingFiles = Array.from(files ?? []);
      const selectedFiles = Array.from(event.target.files);

      if (onChange) {
        onChange([...existingFiles, ...selectedFiles]);
      }

      if (hiddenFileInput.current) {
        hiddenFileInput.current.value = '';
      }
    }
  };

  const handleDelete = (index: number, file?: File) => {
    if (onDelete) {
      onDelete(index, file);
    } else {
      const updatedFiles = Array.from(files).filter((_, i) => i !== index);

      onChange(updatedFiles);
    }
  };

  return (
    <VStack className={cn('p-4 gap-4', containerClassName)}>
      {!hideOnSelectFiles ||
        (hideOnSelectFiles && files.length === 0 && (
          <Pressable
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={accessibleName}
          >
            <Box className="rounded-md border-2 border-dashed border-gray-300 p-6 items-center justify-center gap-3">
              <input
                type="file"
                aria-label={accessibleName}
                ref={hiddenFileInput}
                {...rest}
                style={{ display: 'none' }}
                onChange={handleChange}
              />
              <FilePlus2Icon className="text-typography-300 h-10 w-10" />
              {typeof label === 'string' ? (
                <Text className="text-typography-300">{label}</Text>
              ) : (
                label
              )}
            </Box>
          </Pressable>
        ))}

      {showSelectedFilesList && !!files && (
        <UploadFileList
          files={files}
          onDelete={handleDelete}
        />
      )}
    </VStack>
  );
};

export { FileUploader };
export type {
  UploadFileListProps,
  UploadFileCollection,
} from './UploadFileList';
