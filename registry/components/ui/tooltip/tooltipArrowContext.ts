import { createContext } from 'react';

import type { TooltipProps } from './index';

export type TooltipArrowOptions = {
  hasArrow: boolean;
  arrowSize: number;
  placement: NonNullable<TooltipProps['placement']>;
};

export const DEFAULT_ARROW_SIZE = 12;

/**
 * Carries the root arrow options to `Tooltip.Content`. The provider lives
 * inside the overlay children so it survives the native portal.
 */
export const TooltipArrowContext = createContext<TooltipArrowOptions>({
  hasArrow: false,
  arrowSize: DEFAULT_ARROW_SIZE,
  placement: 'bottom',
});
