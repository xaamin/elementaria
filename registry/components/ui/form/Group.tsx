import type { ElementType } from 'react';
import { twMerge } from 'tailwind-merge';

import { VStack, type VStackProps } from '../vstack';

export type GroupProps = VStackProps & {
  as?: ElementType;
};

const Group = (props: GroupProps) => {
  const { className, as, ...rest } = props;

  if (as) {
    const Tag = as;

    return <Tag {...rest}>{props.children}</Tag>;
  }

  const newClassName = twMerge('w-full mb-3', className);

  return (
    <VStack
      className={newClassName}
      {...rest}
    >
      {props.children}
    </VStack>
  );
};

export { Group };
