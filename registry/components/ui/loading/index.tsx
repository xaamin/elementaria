import { Portal } from '@/components/ui/portal';
import { Spinner } from '@/components/ui/spinner';

import { Box } from '../box';
import { HStack } from '../hstack';

export interface LoadingProps {
  mode?: 'fixed' | 'relative';
}

const Loading = ({ mode = 'fixed' }: LoadingProps) => {
  if (mode === 'relative') {
    return (
      <HStack>
        <Spinner
          size="large"
          className="p-8 z-999"
        />
      </HStack>
    );
  }

  return (
    <Portal
      isOpen
      style={{ zIndex: 999 }}
    >
      <Box className="absolute left-0 right-0 flex flex-col items-center justify-center h-full w-full">
        <Spinner
          size="large"
          className="mt-6 z-999"
        />
      </Box>
    </Portal>
  );
};

export { Loading };
