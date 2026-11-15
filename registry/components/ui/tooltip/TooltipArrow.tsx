import { useContext } from 'react';
import type { ViewStyle } from 'react-native';

import { View } from '../view';
import { TooltipArrowContext } from './tooltipArrowContext';

type Side = 'top' | 'bottom' | 'left' | 'right';

// Same color as the template content (`bg-background/90`), on the border that
// forms the triangle pointing to the trigger.
const SIDE_CLASSES: Record<Side, string> = {
  top: 'border-t-background/90',
  bottom: 'border-b-background/90',
  left: 'border-l-background/90',
  right: 'border-r-background/90',
};

// Distance from the content corner when the placement aligns to an edge.
const EDGE_INSET = 8;

function sideStyle(side: Side, half: number): ViewStyle {
  if (side === 'top') {
    return {
      top: '100%',
      borderTopWidth: half,
      borderLeftWidth: half,
      borderRightWidth: half,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    };
  }

  if (side === 'bottom') {
    return {
      bottom: '100%',
      borderBottomWidth: half,
      borderLeftWidth: half,
      borderRightWidth: half,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    };
  }

  if (side === 'left') {
    return {
      left: '100%',
      borderLeftWidth: half,
      borderTopWidth: half,
      borderBottomWidth: half,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
    };
  }

  return {
    right: '100%',
    borderRightWidth: half,
    borderTopWidth: half,
    borderBottomWidth: half,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  };
}

function alignStyle(side: Side, align: string | undefined, half: number) {
  const vertical = side === 'top' || side === 'bottom';

  if (vertical && align === 'left') {
    return { left: EDGE_INSET };
  }

  if (vertical && align === 'right') {
    return { right: EDGE_INSET };
  }

  if (vertical) {
    return { left: '50%', marginLeft: -half } as ViewStyle;
  }

  if (align === 'top') {
    return { top: EDGE_INSET };
  }

  if (align === 'bottom') {
    return { bottom: EDGE_INSET };
  }

  return { top: '50%', marginTop: -half } as ViewStyle;
}

/**
 * Decorative triangle on the content edge facing the trigger. It follows the
 * requested `placement`; the primitive does not expose the flipped placement.
 */
const TooltipArrow = () => {
  const { hasArrow, arrowSize, placement } = useContext(TooltipArrowContext);

  if (!hasArrow || arrowSize <= 0) {
    return null;
  }

  const [side, align] = placement.split(' ') as [Side, string | undefined];

  const half = arrowSize / 2;

  return (
    <View
      aria-hidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      className={SIDE_CLASSES[side]}
      style={[
        { position: 'absolute', width: 0, height: 0 },
        sideStyle(side, half),
        alignStyle(side, align, half),
      ]}
    />
  );
};

export { TooltipArrow };
