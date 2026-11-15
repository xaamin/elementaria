import { Children, cloneElement, isValidElement, ReactNode } from 'react';

import { cn } from '@/components/cn';
import { HStack } from '@/components/z/hstack';

export interface ButtonGroupProps {
  children: ReactNode;
}

/** @deprecated Use ButtonGroupProps. */
export type ButtonProps = ButtonGroupProps;

const ButtonGroup = ({ children }: ButtonGroupProps) => {
  const buttons = Children.toArray(children).filter((child) =>
    isValidElement<{ className?: string }>(child),
  );

  const last = buttons.length - 1;

  return (
    <HStack>
      {buttons.map((child, index) => {
        const first = index === 0;

        const final = index === last;

        return cloneElement(child, {
          className: cn(child.props.className, {
            '!rounded-tr-none !rounded-br-none': !final,
            '!rounded-tl-none !rounded-bl-none !border-l-0': !first,
          }),
        });
      })}
    </HStack>
  );
};

export default ButtonGroup;
