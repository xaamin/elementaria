import { ComponentType, ReactNode } from 'react';

import { cn } from '@/components/cn';
import { Grid as ZGrid } from '@/components/z/grid';
import { View } from '@/components/z/view';

import { withDomViewProps } from '../dom-view-props';
import type { GridPrimitiveProps } from './types';

const Grid = withDomViewProps(ZGrid as ComponentType<GridPrimitiveProps>);

export interface RowProps extends GridPrimitiveProps {
  gap?: number;
  children: ReactNode;
  className?: string;
}

const Row = (props: RowProps) => {
  const { children, gap = 2, className, ...rest } = props;

  return (
    <View className={`col-span-12 pb-${gap}`}>
      <Grid
        _extra={{
          className: 'grid-cols-12',
        }}
        {...rest}
        className={cn(`gap-${gap}`, className)}
      >
        {children}
      </Grid>
    </View>
  );
};

export default Row;
