import type { RefAttributes } from 'react';
import { forwardRef } from 'react';
import { useWindowDimensions } from 'react-native';

import { HStack as TheHStack } from '@/components/z/hstack';

import { withDomViewProps } from '../dom-view-props';
import { type StackVariantKeys, withFrozenProps } from '../primitive';
import { VStack } from '../vstack';
import type { HStackProps } from './types';

const SMALL_BREAKPOINT = 640;

const BaseHStack = withDomViewProps(
  withFrozenProps<Omit<HStackProps, 'responsive'>, StackVariantKeys>(TheHStack),
);

type HStackElement = HStackProps extends RefAttributes<infer T> ? T : never;

const HStack = forwardRef<HStackElement, Omit<HStackProps, 'ref'>>(
  function HStack({ responsive = false, ...props }, ref) {
    const { width } = useWindowDimensions();

    if (responsive && width < SMALL_BREAKPOINT) {
      return (
        <VStack
          {...props}
          ref={ref}
        />
      );
    }

    return (
      <BaseHStack
        {...props}
        ref={ref}
      />
    );
  },
);

HStack.displayName = 'HStack';

export type { HStackProps };

export { HStack };
