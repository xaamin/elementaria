import {
  Calendar,
  fromDateId,
  toDateId,
} from '@marceloterreiro/flash-calendar';
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
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

type CalendarView = 'days' | 'years' | 'months';

const YEARS_PER_PAGE = 12;

const MONTHS = Array.from({ length: 12 }, (_, month) => month);

const hiddenMonthRow = {
  rowMonth: { container: { display: 'none' as const } },
};

const navigationLabels: Record<CalendarView, [string, string]> = {
  days: ['Mes anterior', 'Mes siguiente'],
  years: ['Años anteriores', 'Años siguientes'],
  months: ['Año anterior', 'Año siguiente'],
};

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
  minDate,
  maxDate,
  allowYearNavigation = false,
  ...rest
}: DateInputProps) {
  const colorScheme = useColorScheme();
  const { width, height } = useWindowDimensions();
  const calendarInstanceId = useId();
  const triggerRef = useRef<ComponentRef<typeof Pressable>>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [monthId, setMonthId] = useState(() => toDateId(new Date()));
  const [view, setView] = useState<CalendarView>('days');

  const blocked = disabled || isDisabled || readonly || isReadOnly;
  const invalid = isInvalid || (!!error && isFieldDirty);
  const selectedDay = validDay(value);
  const usePanel =
    presentation === 'auto' && Platform.OS === 'web' && width >= 768;
  const fieldLabel =
    accessibilityLabel ?? (typeof label === 'string' ? label : 'Fecha');
  const viewDate = fromDateId(monthId);
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const firstYear = viewYear - (viewYear % YEARS_PER_PAGE);
  const years = Array.from(
    { length: YEARS_PER_PAGE },
    (_, index) => firstYear + index,
  );
  const [previousLabel, nextLabel] = navigationLabels[view];
  const title = viewTitle(view, viewDate, firstYear);
  const minDay = validDay(minDate ?? '');
  const maxDay = validDay(maxDate ?? '');
  const minKey = minDay ? monthKey(fromDateId(minDay)) : -Infinity;
  const maxKey = maxDay ? monthKey(fromDateId(maxDay)) : Infinity;
  const minYear = Math.floor(minKey / 12);
  const maxYear = Math.floor(maxKey / 12);
  const todayId = toDateId(new Date());
  const todayAllowed = isInRange(todayId, minDay, maxDay);
  let canGoBack = monthKey(viewDate) > minKey;
  let canGoForward = monthKey(viewDate) < maxKey;

  if (view === 'years') {
    canGoBack = firstYear > minYear;
    canGoForward = firstYear + YEARS_PER_PAGE - 1 < maxYear;
  } else if (view === 'months') {
    canGoBack = viewYear > minYear;
    canGoForward = viewYear < maxYear;
  }

  const openCalendar = () => {
    if (blocked) {
      return;
    }

    const date = fromDateId(selectedDay || todayId);

    showMonth(date.getFullYear(), date.getMonth());
    setView('days');
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
    if (blocked || (day && !isInRange(day, minDay, maxDay))) {
      return;
    }

    onChangeText?.(day);
    closeCalendar();
  };

  const showMonth = (year: number, month: number) => {
    const key = Math.min(Math.max(year * 12 + month, minKey), maxKey);

    setMonthId(toDateId(new Date(Math.floor(key / 12), key % 12, 1)));
  };

  const navigate = (direction: number) => {
    if (view === 'years') {
      showMonth(viewYear + direction * YEARS_PER_PAGE, viewMonth);
    } else if (view === 'months') {
      showMonth(viewYear + direction, viewMonth);
    } else {
      showMonth(viewYear, viewMonth + direction);
    }
  };

  const toggleView = () => {
    if (view === 'days') {
      setView('years');
    } else if (view === 'years') {
      setView('days');
    } else {
      setView('years');
    }
  };

  const selectYear = (year: number) => {
    showMonth(year, viewMonth);
    setView('months');
  };

  const selectMonth = (month: number) => {
    showMonth(viewYear, month);
    setView('days');
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
      <Box className="mb-2 flex-row items-center justify-between">
        <Button
          icon
          size="xs"
          variant="ghost"
          accessibilityLabel={previousLabel}
          disabled={!canGoBack}
          onPress={() => navigate(-1)}
        >
          <Icon as={ChevronLeft} />
        </Button>
        {allowYearNavigation && (
          <Button
            size="xs"
            variant="ghost"
            accessibilityLabel="Cambiar mes y año"
            onPress={toggleView}
          >
            <Text className="font-semibold text-typography-900">{title}</Text>
            <Icon
              as={ChevronDown}
              className="h-4 w-4 text-typography-500"
            />
          </Button>
        )}
        {!allowYearNavigation && (
          <Text className="font-semibold text-typography-900">{title}</Text>
        )}
        <Button
          icon
          size="xs"
          variant="ghost"
          accessibilityLabel={nextLabel}
          disabled={!canGoForward}
          onPress={() => navigate(1)}
        >
          <Icon as={ChevronRight} />
        </Button>
      </Box>
      <Box className="min-h-[350px] w-full">
        {view === 'days' && (
          <Calendar
            calendarInstanceId={calendarInstanceId}
            calendarMonthId={monthId}
            calendarFormatLocale="es-MX"
            calendarFirstDayOfWeek="monday"
            calendarColorScheme={colorScheme === 'dark' ? 'dark' : 'light'}
            calendarDayHeight={40}
            calendarMonthHeaderHeight={0}
            calendarMinDateId={minDay || undefined}
            calendarMaxDateId={maxDay || undefined}
            calendarActiveDateRanges={
              selectedDay ? [{ startId: selectedDay, endId: selectedDay }] : []
            }
            getCalendarMonthFormat={emptyMonthTitle}
            theme={hiddenMonthRow}
            onCalendarDayPress={selectDay}
          />
        )}
        {view === 'years' && (
          <Box className="flex-row flex-wrap">
            {years.map((year) => (
              <Box
                key={year}
                className="w-1/4 p-1"
              >
                <Button
                  block
                  size="sm"
                  variant={year === viewYear ? 'primary' : 'ghost'}
                  disabled={year < minYear || year > maxYear}
                  onPress={() => selectYear(year)}
                >
                  {String(year)}
                </Button>
              </Box>
            ))}
          </Box>
        )}
        {view === 'months' && (
          <Box className="flex-row flex-wrap">
            {MONTHS.map((month) => (
              <Box
                key={month}
                className="w-1/4 p-1"
              >
                <Button
                  block
                  size="sm"
                  variant={month === viewMonth ? 'primary' : 'ghost'}
                  disabled={
                    viewYear * 12 + month < minKey ||
                    viewYear * 12 + month > maxKey
                  }
                  accessibilityLabel={monthName(month, 'long')}
                  onPress={() => selectMonth(month)}
                >
                  {monthName(month, 'short')}
                </Button>
              </Box>
            ))}
          </Box>
        )}
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
        disabled={!todayAllowed}
        onPress={() => selectDay(todayId)}
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

function monthKey(date: Date) {
  return date.getFullYear() * 12 + date.getMonth();
}

function isInRange(day: string, minDay: string, maxDay: string) {
  return (!minDay || day >= minDay) && (!maxDay || day <= maxDay);
}

function emptyMonthTitle() {
  return '';
}

function viewTitle(view: CalendarView, date: Date, firstYear: number) {
  if (view === 'years') {
    return `${firstYear} – ${firstYear + YEARS_PER_PAGE - 1}`;
  }

  if (view === 'months') {
    return String(date.getFullYear());
  }

  return capitalize(
    date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }),
  );
}

function monthName(month: number, format: 'long' | 'short') {
  return capitalize(
    new Date(2000, month, 1)
      .toLocaleDateString('es-MX', { month: format })
      .replace('.', ''),
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
