import type { PropsWithChildren } from 'react';

import { FormControlLabel } from '@/components/z/form-control';
import { Text } from '@/components/z/text';

export type LabelProps = PropsWithChildren;

const Label = ({ children }: LabelProps) => {
  const isStringChild = typeof children;

  return (
    <FormControlLabel>
      {isStringChild === 'string' && <Text>{children}</Text>}
      {isStringChild !== 'string' && children}
    </FormControlLabel>
  );
};

export { Label };
