import React, { forwardRef, ReactNode } from 'react';

import { cn } from '@/components/cn';
import { Grid as ZGrid } from '@/components/z/grid';

import { withDomViewProps } from '../dom-view-props';
import Col from './Col';
import Row from './Row';
import type { GridPrimitiveElement, GridPrimitiveProps } from './types';

const TheGrid = withDomViewProps(
  ZGrid as React.ComponentType<GridPrimitiveProps>,
);

export interface GridProps extends GridPrimitiveProps {
  gap?: number;
  children: ReactNode;
  className?: string;
}

const Grid: React.FC<GridProps> = forwardRef<GridPrimitiveElement, GridProps>(
  (props, ref) => {
    const { children, gap = 2, className, ...rest } = props;

    return (
      <TheGrid
        _extra={{
          className: 'grid-cols-12',
        }}
        {...rest}
        className={cn(`gap-${gap}`, className)}
        ref={ref}
      >
        {children}
      </TheGrid>
    );
  },
);

Grid.displayName = 'Grid';

export default Object.assign(Grid, {
  Row: Row,
  Col: Col,
});
