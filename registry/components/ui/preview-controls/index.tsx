import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

export interface PreviewControlsProps {
  title?: string;
  count: number;
  showCounter?: boolean;
  onIndexChange: (index: number) => void;
}

const PreviewControls = ({
  title,
  count,
  showCounter = true,
  onIndexChange,
}: PreviewControlsProps) => {
  const [index, setIndex] = useState(0);

  const hasNextFile = count > 0 && index < count - 1;

  useEffect(() => {
    onIndexChange(index);
  }, [index]);

  const handlePrev = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (hasNextFile) {
      setIndex((prev) => prev + 1);
    }
  };

  if (count === 1 && !title) {
    return null;
  }

  return (
    <HStack className="w-full justify-end gap-4 items-center mb-4">
      <HStack className="items-center  flex-1 gap-1">
        {count > 1 && showCounter && (
          <Text
            size="xl"
            className="text-typography-300 border border-background-100 px-3 py-1"
          >
            {index + 1}/{count}
          </Text>
        )}

        {!!title && (
          <Text
            isTruncated
            className="grow text-sm text-typography-800 font-medium"
          >
            {title}
          </Text>
        )}
      </HStack>

      {count > 1 && (
        <HStack className="items-center">
          <Button
            variant="ghost"
            disabled={index === 0}
            rounded
            accessibilityLabel="Anterior"
            onPress={handlePrev}
          >
            <ChevronLeftIcon />
          </Button>

          <Button
            variant="ghost"
            rounded
            disabled={!hasNextFile}
            accessibilityLabel="Siguiente"
            onPress={handleNext}
          >
            <ChevronRightIcon />
          </Button>
        </HStack>
      )}
    </HStack>
  );
};

export { PreviewControls };
