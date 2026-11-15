import type { ReactNode } from 'react';

export interface Step {
  id: string;
  title: string;
  description?: string;
  content?: ReactNode;
  disabled?: boolean;
}

export type StepperOrientation = 'horizontal' | 'vertical';

export type StepperMobileIndicator = 'circles' | 'progress';

export type StepperLabelPlacement = 'active-bottom' | 'bottom';

export interface StepperProps {
  steps: Step[];

  /** Zero-based active step */
  activeStep?: number;

  /** Initial step for uncontrolled mode */
  defaultActiveStep?: number;

  onStepChange?: (step: number) => void;

  /** Called when the final step is completed */
  onComplete?: () => void | Promise<void>;

  /** Optional async validation before advancing */
  onBeforeNext?: (step: number) => boolean | Promise<boolean>;

  orientation?: StepperOrientation;

  /** Allow direct navigation to any enabled step */
  allowStepSelect?: boolean;

  /** Show Previous and Next buttons */
  showControls?: boolean;

  nextLabel?: string;
  previousLabel?: string;
  completeLabel?: string;

  /** Hide step descriptions */
  hideDescriptions?: boolean;

  className?: string;

  mobileIndicator?: StepperMobileIndicator;

  labelPlacement?: StepperLabelPlacement;
}
