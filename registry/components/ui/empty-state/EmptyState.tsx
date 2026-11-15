import { cn } from '@/components/cn';

import { Button } from '../button';
import { Image } from '../image';
import { Text } from '../text';
import { VStack } from '../vstack';
import emptyList from './list-empty.png';

export interface EmptyStateProps {
  alt?: string;
  title?: string;
  description: string | string[];
  image?: string;
  imageClassName?: string;
  buttonText?: string;
  buttonVariant?: string;
  buttonAction?: () => void;
}

const EmptyState = ({
  title,
  description,
  image = emptyList,
  imageClassName,
  alt,
  buttonText,
  buttonAction,
  buttonVariant = 'light',
}: EmptyStateProps) => {
  const lines = typeof description === 'string' ? [description] : description;

  return (
    <VStack className="items-center gap-4">
      <Image
        src={image}
        size="none"
        alt={alt ?? title}
        className={cn('aspect-[350/350] w-full max-w-[250px]', imageClassName)}
      />

      <VStack className="items-center gap-2">
        {!!title && <Text className="font-bold text-xl">{title}</Text>}

        <VStack>
          {lines.map((line, index) => (
            <Text
              className="font-medium"
              key={`line-${index}`}
            >
              {line}
            </Text>
          ))}
        </VStack>
      </VStack>
      {!!buttonText && (
        <VStack className="items-center">
          <Button
            variant={buttonVariant}
            onPress={buttonAction}
          >
            {buttonText}
          </Button>
        </VStack>
      )}
    </VStack>
  );
};

export { EmptyState };
