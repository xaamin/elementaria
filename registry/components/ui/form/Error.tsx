import { HStack } from '@/components/ui/hstack';
import { AlertCircleIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export type ErrorItem = string | string[] | boolean;

export type ErrorProps = {
  error?: ErrorItem;
};

const ErrorMessage = ({ message }: { message: string }) => (
  <Text
    role="alert"
    className="text-error-700"
  >
    {message}
  </Text>
);

/**
 * API validation can deliver `{ message }` items or `{ errors: [...] }`
 * collections at runtime even though the declared contract only names
 * strings, so every shape is reduced to its text messages.
 */
const collectMessages = (error: unknown): string[] => {
  if (typeof error === 'string') {
    if (error === '') {
      return [];
    }

    return [error];
  }

  if (Array.isArray(error)) {
    return error.flatMap(collectMessages);
  }

  if (error && typeof error === 'object') {
    const { message, errors } = error as {
      message?: unknown;
      errors?: unknown;
    };

    if (errors !== undefined) {
      return collectMessages(errors);
    }

    return collectMessages(message);
  }

  return [];
};

const Error = (props: ErrorProps) => {
  const { error } = props;

  const messages = collectMessages(error);

  if (messages.length === 0) {
    return null;
  }

  return (
    <HStack className="flex flex-row justify-start items-center mt-1 gap-1">
      <Icon
        as={AlertCircleIcon}
        className="h-[18px] w-[18px] text-error-700 fill-none"
      />
      <VStack className="flex-1 min-w-0">
        {messages.map((message, index) => (
          <ErrorMessage
            message={message}
            key={`error-message-${index}`}
          />
        ))}
      </VStack>
    </HStack>
  );
};

export { Error };
