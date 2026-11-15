import {
  Calendar,
  fromDateId,
  toDateId,
} from '@marceloterreiro/flash-calendar';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react-native';
import type { ComponentRef } from 'react';
import { useId, useRef, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { cn } from '@/components/cn';
import { useColorScheme } from '@/components/hooks/useColorScheme';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Modal } from '@/components/ui/modal';
import type { PressableProps } from '@/components/ui/pressable';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import {
  Popover,
  PopoverBackdrop,
  PopoverContent,
} from '@/components/z/popover';

import type { DateInputProps } from './DateInput.types';
import { InputWrapper } from './InputWrapper';

export type { DateInputProps } from './DateInput.types';

export function DateInput({
  value = '',
  onChangeText,
  disabled,
  isDisabled,
  readonly,
  isReadOnly,
  isRequired,
  required,
  label,
  accessibilityLabel,
  inputClassName,
  error,
  isFieldDirty,
  isInvalid,
  presentation = 'modal',
  showPanelLabel = false,
  ...rest
}: DateInputProps) {
  const colorScheme = useColorScheme();
  const { width, height } = useWindowDimensions();
  const calendarInstanceId = useId();
  const triggerRef = useRef<ComponentRef<typeof Pressable>>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [monthId, setMonthId] = useState(() => toDateId(new Date()));

  const blocked = disabled || isDisabled || readonly || isReadOnly;
  const invalid = isInvalid || (!!error && isFieldDirty);
  const selectedDay = validDay(value);
  const usePanel =
    presentation === 'auto' && Platform.OS === 'web' && width >= 768;
  const fieldLabel =
    accessibilityLabel ?? (typeof label === 'string' ? label : 'Fecha');

  const openCalendar = () => {
    if (blocked) {
      return;
    }

    setMonthId(selectedDay || toDateId(new Date()));
    setIsOpen(true);
  };

  const closeCalendar = () => {
    setIsOpen(false);

    const trigger = triggerRef.current;

    if (trigger && 'focus' in trigger && typeof trigger.focus === 'function') {
      trigger.focus();
    }
  };

  const selectDay = (day: string) => {
    if (blocked) {
      return;
    }

    onChangeText?.(day);
    closeCalendar();
  };

  const moveMonth = (offset: number) => {
    const date = fromDateId(monthId);

    date.setDate(1);
    date.setMonth(date.getMonth() + offset);
    setMonthId(toDateId(date));
  };

  const renderTrigger = (triggerProps: Partial<PressableProps> = {}) => (
    <Pressable
      {...triggerProps}
      ref={(element) => {
        triggerRef.current = element;

        const { ref } = triggerProps;

        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      }}
      accessibilityRole="button"
      accessibilityLabel={`${fieldLabel}: ${value || 'Sin fecha'}`}
      accessibilityHint="Seleccionar fecha"
      accessibilityState={{
        disabled: !!blocked,
        expanded: !!isOpen && !blocked,
      }}
      disabled={!!blocked}
      onPress={openCalendar}
      className={cn(
        'h-10 w-full min-w-0 flex-row items-center justify-between gap-2 rounded border border-background-300 bg-background-0 px-3 web:focus-visible:outline-primary-700',
        invalid && 'border-error-700',
        (disabled || isDisabled) && 'opacity-40',
        inputClassName,
      )}
    >
      <Text
        className={cn(
          'flex-1 text-sm text-typography-900',
          !value && 'text-typography-500',
        )}
      >
        {value || 'AAAA-MM-DD'}
      </Text>
      <Icon
        as={CalendarDays}
        className="h-4 w-4 text-typography-500"
      />
    </Pressable>
  );

  const calendarContent = (
    <>
      <Box className="mb-2 flex-row justify-between">
        <Button
          icon
          size="xs"
          variant="ghost"
          accessibilityLabel="Mes anterior"
          onPress={() => moveMonth(-1)}
        >
          <Icon as={ChevronLeft} />
        </Button>
        <Button
          icon
          size="xs"
          variant="ghost"
          accessibilityLabel="Mes siguiente"
          onPress={() => moveMonth(1)}
        >
          <Icon as={ChevronRight} />
        </Button>
      </Box>
      <Box className="min-h-[350px] w-full">
        <Calendar
          calendarInstanceId={calendarInstanceId}
          calendarMonthId={monthId}
          calendarFormatLocale="es-MX"
          calendarFirstDayOfWeek="monday"
          calendarColorScheme={colorScheme === 'dark' ? 'dark' : 'light'}
          calendarDayHeight={40}
          calendarActiveDateRanges={
            selectedDay ? [{ startId: selectedDay, endId: selectedDay }] : []
          }
          onCalendarDayPress={selectDay}
        />
      </Box>
    </>
  );

  const actions = (
    <>
      <Button
        size="xs"
        variant="ghost"
        onPress={() => selectDay('')}
      >
        Limpiar
      </Button>
      <Button
        size="xs"
        variant="ghost"
        onPress={closeCalendar}
      >
        Cancelar
      </Button>
      <Button
        size="xs"
        onPress={() => selectDay(toDateId(new Date()))}
      >
        Hoy
      </Button>
    </>
  );

  return (
    <InputWrapper
      {...rest}
      label={label}
      error={error}
      isFieldDirty={isFieldDirty}
      isInvalid={isInvalid}
      isDisabled={disabled || isDisabled}
      isReadOnly={readonly || isReadOnly}
      isRequired={isRequired || required}
    >
      {usePanel ? (
        <Popover
          isOpen={isOpen && !blocked}
          placement="bottom left"
          offset={6}
          shouldFlip
          onClose={closeCalendar}
          finalFocusRef={triggerRef}
          trigger={renderTrigger}
        >
          <PopoverBackdrop className="bg-transparent" />
          <PopoverContent
            accessibilityLabel={fieldLabel}
            style={{ width: 360, maxWidth: width - 24, maxHeight: height - 24 }}
            className="p-4"
          >
            <ScrollView style={{ maxHeight: height - 56 }}>
              {showPanelLabel && (
                <Text className="mb-2 font-semibold text-typography-900">
                  {fieldLabel}
                </Text>
              )}
              {calendarContent}
              <Box className="mt-4 flex-row flex-wrap justify-end gap-2">
                {actions}
              </Box>
            </ScrollView>
          </PopoverContent>
        </Popover>
      ) : (
        renderTrigger()
      )}
      {!usePanel && isOpen && !blocked && (
        <Modal
          isOpen
          size="sm"
          onClose={closeCalendar}
        >
          <Modal.Header>
            <Modal.Title>{fieldLabel}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{calendarContent}</Modal.Body>
          <Modal.Footer className="flex-wrap gap-2">{actions}</Modal.Footer>
        </Modal>
      )}
    </InputWrapper>
  );
}

function validDay(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return '';
  }

  const date = fromDateId(value);

  return Number.isFinite(date.getTime()) && toDateId(date) === value
    ? value
    : '';
}
