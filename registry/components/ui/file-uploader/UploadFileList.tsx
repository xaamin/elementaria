import { Trash2Icon } from 'lucide-react-native';
import type { ReactNode } from 'react';

import { formatBytes } from '@/components/lib/formatBytes';
import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export type UploadFileCollection = FileList | readonly File[];

export interface UploadFileListProps {
  files: UploadFileCollection;
  allowDelete?: boolean;
  onRenderAttributes?: (file: File, index?: number) => ReactNode;
  onRenderActions?: (file: File, index?: number) => ReactNode;
  onDelete: (index: number, file?: File) => void;
}

const UploadFileList = ({
  files,
  allowDelete = true,
  onDelete,
  onRenderAttributes,
  onRenderActions,
}: UploadFileListProps) => {
  return (
    <ScrollView className="flex overflow-auto grow">
      {Array.from(files).map((file, index) => (
        <Box
          key={file.name}
          className="mt-4 p-4 border rounded-md border-gray-200 overflow-hidden"
        >
          <HStack className="gap-4">
            <VStack className="grow">
              <Text
                className="font-medium"
                isTruncated
              >
                {file.name}
              </Text>
              <HStack className="items-center gap-2 mt-2">
                <Badge
                  variant="warning"
                  outline
                >
                  {file.name.split('.').pop()?.toUpperCase()}
                </Badge>
                {onRenderAttributes?.(file)}
                <Text className="text-sm text-typography-500">
                  {formatBytes(file.size)}
                </Text>
              </HStack>
            </VStack>
            <HStack className="justify-center items-center x-4">
              {allowDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-3.5"
                  accessibilityLabel={`Eliminar ${file.name}`}
                  onPress={() => onDelete(index, file)}
                >
                  <Trash2Icon />
                </Button>
              )}

              {onRenderActions?.(file, index)}
            </HStack>
          </HStack>
        </Box>
      ))}
    </ScrollView>
  );
};

export { UploadFileList };
