import { PropsWithChildren } from 'react';

import {
  FormControlHelper,
  FormControlHelperText,
} from '@/components/z/form-control';

export type HelperTextProps = PropsWithChildren;

const HelperText = (props: HelperTextProps) => {
  const { children } = props;

  return (
    <FormControlHelper>
      <FormControlHelperText>{children}</FormControlHelperText>
    </FormControlHelper>
  );
};

export { HelperText };
