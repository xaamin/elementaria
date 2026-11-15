import { Fragment, useCallback, useState } from 'react';
import { useWindowDimensions } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import type { StepperProps } from './types';

export type {
  Step,
  StepperLabelPlacement,
  StepperMobileIndicator,
  StepperOrientation,
  StepperProps,
} from './types';

const MOBILE_BREAKPOINT = 640;

export function Stepper({
  steps,
  activeStep: controlledActiveStep,
  defaultActiveStep = 0,
  onStepChange,
  onComplete,
  onBeforeNext,
  orientation = 'horizontal',
  allowStepSelect = true,
  showControls = true,
  nextLabel = 'Next',
  previousLabel = 'Previous',
  completeLabel = 'Complete',
  hideDescriptions = false,
  mobileIndicator = 'circles',
  labelPlacement = 'bottom',
  className,
}: StepperProps) {
  const { width } = useWindowDimensions();

  const isControlled = controlledActiveStep !== undefined;

  const [internalActiveStep, setInternalActiveStep] =
    useState(defaultActiveStep);

  const [loading, setLoading] = useState(false);

  const activeStep = isControlled ? controlledActiveStep : internalActiveStep;

  const isVertical = orientation === 'vertical';
  const isCompact = !isVertical && width < MOBILE_BREAKPOINT;

  const currentStep = steps[activeStep];
  const isLastStep = activeStep === steps.length - 1;

  const progress = steps.length ? ((activeStep + 1) / steps.length) * 100 : 0;

  const updateStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= steps.length) {
        return;
      }

      if (!isControlled) {
        setInternalActiveStep(index);
      }

      onStepChange?.(index);
    },
    [isControlled, onStepChange, steps.length],
  );

  const handleNext = useCallback(async () => {
    if (loading || !currentStep) {
      return;
    }

    setLoading(true);

    try {
      const canContinue = await onBeforeNext?.(activeStep);

      if (canContinue === false) {
        return;
      }

      if (isLastStep) {
        await onComplete?.();
        return;
      }

      const nextIndex = steps.findIndex(
        (step, index) => index > activeStep && !step.disabled,
      );

      if (nextIndex !== -1) {
        updateStep(nextIndex);
      }
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    currentStep,
    onBeforeNext,
    activeStep,
    isLastStep,
    onComplete,
    steps,
    updateStep,
  ]);

  const handlePrevious = useCallback(() => {
    if (loading) {
      return;
    }

    for (let index = activeStep - 1; index >= 0; index--) {
      if (!steps[index].disabled) {
        updateStep(index);
        break;
      }
    }
  }, [activeStep, loading, steps, updateStep]);

  const renderCircle = (
    step: (typeof steps)[number],
    index: number,
    compact = false,
  ) => {
    const isCompleted = index < activeStep;
    const isActive = index === activeStep;
    const isDisabled = !!step.disabled;

    const isStepDisabled =
      !allowStepSelect || isDisabled || isActive || loading;

    let indicatorClass = 'bg-transparent border-outline-300';

    let numberClass = 'text-typography-500';

    if (isCompleted) {
      indicatorClass = 'bg-primary-600 border-primary-600';
      numberClass = 'text-white';
    } else if (isActive) {
      indicatorClass = 'bg-transparent border-primary-600';
      numberClass = 'text-primary-600';
    }

    return (
      <Pressable
        disabled={isStepDisabled}
        onPress={() => {
          if (!isStepDisabled) {
            updateStep(index);
          }
        }}
        className="shrink-0 !opacity-100"
        accessibilityRole="button"
        accessibilityState={{
          selected: isActive,
          disabled: isStepDisabled,
        }}
        accessibilityLabel={`Paso ${index + 1}: ${step.title}`}
      >
        <Box
          className={`
            rounded-full border-2
            items-center justify-center
            ${compact ? 'h-7 w-7' : 'h-9 w-9'}
            ${indicatorClass}
          `}
        >
          <Text
            className={`
              font-semibold
              ${compact ? 'text-xs' : 'text-sm'}
              ${numberClass}
              ${isDisabled ? 'opacity-40' : ''}
            `}
          >
            {isCompleted ? '✓' : index + 1}
          </Text>
        </Box>
      </Pressable>
    );
  };

  const renderStepLabel = (
    step: (typeof steps)[number],
    index: number,
    centered = false,
  ) => {
    const isActive = index === activeStep;
    const isCompleted = index < activeStep;

    let titleClass = 'text-typography-500';

    if (isActive) {
      titleClass = 'text-primary-600';
    } else if (isCompleted) {
      titleClass = 'text-typography-900';
    }

    return (
      <VStack
        className={centered ? 'items-center' : 'flex-1'}
        space="xs"
      >
        <Text
          className={`
            text-sm font-semibold
            ${centered ? 'text-center' : ''}
            ${titleClass}
          `}
        >
          {step.title}
        </Text>

        {!hideDescriptions && step.description && (
          <Text
            className={`
              text-xs text-typography-500
              ${centered ? 'text-center' : ''}
            `}
          >
            {step.description}
          </Text>
        )}
      </VStack>
    );
  };

  const renderActiveLabel = () => (
    <VStack
      className="items-start"
      space="xs"
    >
      <Text className="text-lg font-semibold text-typography-900">
        {currentStep.title}
      </Text>

      {!hideDescriptions && currentStep.description && (
        <Text className="text-sm text-typography-500">
          {currentStep.description}
        </Text>
      )}
    </VStack>
  );

  const renderMobileProgress = () => (
    <Box className="w-full h-1.5 rounded-full bg-outline-200 overflow-hidden">
      <Box
        className="h-full rounded-full bg-primary-600"
        style={{ width: `${progress}%` }}
      />
    </Box>
  );

  const renderMobileIndicator = () => (
    <VStack space="md">
      <HStack className="items-center justify-between">
        <Text className="text-sm font-medium text-typography-500">
          Paso {activeStep + 1} de {steps.length}
        </Text>

        {mobileIndicator === 'progress' && (
          <Text className="text-sm font-medium text-typography-500">
            {Math.round(progress)}%
          </Text>
        )}
      </HStack>

      {mobileIndicator === 'circles' ? (
        <HStack
          className="w-full items-center"
          space="xs"
        >
          {steps.map((step, index) => (
            <Fragment key={step.id}>
              {renderCircle(step, index, true)}

              {index < steps.length - 1 && (
                <Box
                  className={`
                    flex-1 h-0.5 rounded-full
                    ${index < activeStep ? 'bg-primary-600' : 'bg-outline-300'}
                  `}
                />
              )}
            </Fragment>
          ))}
        </HStack>
      ) : (
        renderMobileProgress()
      )}

      {renderActiveLabel()}
    </VStack>
  );

  // Variante 1: cada indicador tiene su título y descripción debajo.
  const renderHorizontalBottom = () => (
    <HStack
      className="w-full items-start"
      space="xs"
    >
      {steps.map((step, index) => (
        <Fragment key={step.id}>
          <VStack
            className="flex-1 items-center"
            space="sm"
          >
            {renderCircle(step, index)}
            {renderStepLabel(step, index, true)}
          </VStack>

          {index < steps.length - 1 && (
            <Box className="flex-1 h-0.5 bg-outline-300 mt-[18px]" />
          )}
        </Fragment>
      ))}
    </HStack>
  );

  // Variante 2: indicadores arriba y etiqueta del paso activo debajo.
  const renderHorizontalActiveBottom = () => (
    <VStack
      className="w-full"
      space="lg"
    >
      <HStack
        className="w-full items-center"
        space="xs"
      >
        {steps.map((step, index) => (
          <Fragment key={step.id}>
            {renderCircle(step, index)}

            {index < steps.length - 1 && (
              <Box
                className={`
                  flex-1 h-0.5 rounded-full
                  ${index < activeStep ? 'bg-primary-600' : 'bg-outline-300'}
                `}
              />
            )}
          </Fragment>
        ))}
      </HStack>

      {renderActiveLabel()}
    </VStack>
  );

  const renderHorizontalIndicator = () => {
    if (labelPlacement === 'active-bottom') {
      return renderHorizontalActiveBottom();
    }

    return renderHorizontalBottom();
  };

  const renderVerticalIndicator = () => (
    <VStack space="none">
      {steps.map((step, index) => {
        const isCompleted = index < activeStep;
        const isLast = index === steps.length - 1;

        return (
          <HStack
            key={step.id}
            space="md"
          >
            <VStack className="items-center">
              {renderCircle(step, index)}

              {!isLast && (
                <Box
                  className={`
                    w-0.5 flex-1 min-h-10
                    ${isCompleted ? 'bg-primary-600' : 'bg-outline-300'}
                  `}
                />
              )}
            </VStack>

            <Box className="flex-1 pb-6">{renderStepLabel(step, index)}</Box>
          </HStack>
        );
      })}
    </VStack>
  );

  if (!currentStep) {
    return null;
  }

  return (
    <VStack
      className={className}
      space="lg"
    >
      {isVertical ? (
        <HStack
          className="w-full items-start"
          space="lg"
        >
          <Box className="w-1/3">{renderVerticalIndicator()}</Box>

          <Box
            key={currentStep.id}
            className="flex-1"
          >
            {currentStep.content}
          </Box>
        </HStack>
      ) : (
        <>
          {isCompact ? renderMobileIndicator() : renderHorizontalIndicator()}

          {currentStep.content && (
            <Box key={currentStep.id}>{currentStep.content}</Box>
          )}
        </>
      )}

      {showControls && (
        <HStack className="w-full justify-between items-center">
          <Button
            variant="outline"
            size="xs"
            className="px-4 rounded-lg"
            disabled={activeStep === 0 || loading}
            onPress={handlePrevious}
          >
            {previousLabel}
          </Button>

          <Button
            variant={isLastStep ? 'primary' : 'outline'}
            size="xs"
            className="px-4 rounded-lg"
            disabled={loading}
            onPress={handleNext}
          >
            {isLastStep ? completeLabel : nextLabel}
          </Button>
        </HStack>
      )}
    </VStack>
  );
}
