import { cn } from '../../cn';
import { HStack } from '../hstack';
import type { HStackProps } from '../hstack';

export interface StickyFooterProps extends HStackProps {}

// `lg` equivale al `gap-4` que el pie aplicaba antes como clase base.
const DEFAULT_SPACE = 'lg';

const StickyFooter = ({
  children,
  className,
  space = DEFAULT_SPACE,
  ...rest
}: StickyFooterProps) => {
  return (
    <HStack
      className={cn(
        'p-4 absolute bottom-0 left-0 right-0 bg-background-0 w-full',
        className,
      )}
      space={space}
      {...rest}
    >
      {children}
    </HStack>
  );
};

export { StickyFooter };
