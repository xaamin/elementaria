import { ChevronDown, ChevronUp, Search, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import type { ComponentRef } from 'react';
import type {
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { Platform } from 'react-native';

import { cn } from '@/components/cn';
import { Box } from '@/components/z/box';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/z/form-control';
import { InputIcon, InputSlot } from '@/components/z/input';
import { Portal } from '@/components/z/portal';
import { Pressable } from '@/components/z/pressable';
import { ScrollView } from '@/components/z/scroll-view';
import { Text } from '@/components/z/text';

import { VStack } from '../vstack';
import { InputField } from './Input';
import type { InputFieldProps, InputRef } from './Input';
import { InputRoot } from './InputRoot';

export interface AutocompleteSuggestion {
  value: string;
  label: string;
  description?: string;
}

export interface FixedAutocompleteProps {
  label?: string;
  value?: string;
  onValueChange?: (value: string, suggestion?: AutocompleteSuggestion) => void;
  suggestions?: AutocompleteSuggestion[];
  placeholder?: string;
  maxSuggestions?: number;
  disabled?: boolean;
  required?: boolean;
}

const FixedAutocomplete = ({
  label,
  value: initialValue = '',
  onValueChange,
  suggestions = [],
  placeholder = 'Type to search...',
  maxSuggestions = 5,
  disabled = false,
  required = false,
}: FixedAutocompleteProps) => {
  const [value, setValue] = useState(initialValue);
  const [dimensions, setDimensions] = useState({
    width: 0,
    top: 0,
    left: 0,
  });
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    AutocompleteSuggestion[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<InputRef | null>(null);
  const dropdownRef = useRef<ComponentRef<typeof Box> | null>(null);

  // Filter suggestions based on input value
  useEffect(() => {
    if (value.trim() === '') {
      setFilteredSuggestions(suggestions.slice(0, maxSuggestions));
    } else {
      const filtered = suggestions
        .filter(
          (item) =>
            item.label.toLowerCase().includes(value.toLowerCase()) ||
            item.value.toLowerCase().includes(value.toLowerCase()),
        )
        .slice(0, maxSuggestions);
      setFilteredSuggestions(filtered);
    }
    setActiveIndex(-1);
  }, [value, suggestions, maxSuggestions]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.measure((x, y, width, height, pageX, pageY) => {
        console.log({
          x,
          y,
          width,
          height,
          pageX,
          pageY,
        });
        setDimensions({
          width: width + x + 20,
          top: pageY + 40,
          left: pageX - x,
        });
      });
    }
  }, [inputRef]);

  const handleInputChange = (text: string) => {
    setValue(text);
    setIsOpen(true);
    onValueChange?.(text);
  };

  const handleSuggestionSelect = (suggestion: AutocompleteSuggestion) => {
    setValue(suggestion.label);
    setIsOpen(false);
    setActiveIndex(-1);
    onValueChange?.(suggestion.value, suggestion);
  };

  const handleClear = () => {
    setValue('');
    setIsOpen(false);
    setActiveIndex(-1);
    onValueChange?.('');
  };

  const handleKeyPress: NonNullable<InputFieldProps['onKeyPress']> = (e) => {
    if (!isOpen || filteredSuggestions.length === 0) {
      return;
    }

    const { key } = e.nativeEvent;

    if (key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1,
      );
    } else if (key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSuggestionSelect(filteredSuggestions[activeIndex]);
    } else if (key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    // Check if the blur event is caused by clicking on a suggestion
    const relatedTarget =
      ('relatedTarget' in e && e.relatedTarget) ||
      ('explicitOriginalTarget' in e.nativeEvent &&
        e.nativeEvent.explicitOriginalTarget);
    if (
      typeof Node !== 'undefined' &&
      relatedTarget instanceof Node &&
      dropdownRef.current &&
      'contains' in dropdownRef.current &&
      typeof dropdownRef.current.contains === 'function' &&
      dropdownRef.current.contains(relatedTarget)
    ) {
      return; // Don't close if clicking inside dropdown
    }
    setTimeout(() => setIsOpen(false), 200);
  };

  const hasSuggestions = filteredSuggestions.length > 0;

  const showNoResults = !hasSuggestions && !!value;

  return (
    <FormControl
      isDisabled={disabled}
      isRequired={required}
    >
      {label && (
        <FormControlLabel>
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
      )}

      {/* IMPORTANT: Use relative positioning on parent with higher zIndex */}
      <Box className="relative z-[1000]">
        <InputRoot
          variant="outline"
          size="md"
        >
          <InputIcon
            as={Search}
            className="ml-3"
          />
          <InputField
            ref={inputRef}
            value={value}
            onChangeText={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            aria-label={label}
            className="pl-10"
          />
          <InputSlot
            className="pr-3"
            accessibilityElementsHidden={false}
          >
            {value ? (
              <Pressable
                onPress={handleClear}
                accessibilityRole="button"
                accessibilityLabel="Limpiar"
              >
                <InputIcon
                  as={X}
                  color="$textLight500"
                />
              </Pressable>
            ) : (
              <InputIcon
                as={isOpen ? ChevronUp : ChevronDown}
                color="$textLight500"
              />
            )}
          </InputSlot>
        </InputRoot>

        {/* Dropdown Panel - Fixed positioning issues */}
        {isOpen && (
          <Portal
            isOpen
            useRNModal
          >
            <Box
              ref={dropdownRef}
              style={{
                position: 'absolute',
                zIndex: 1001,
                ...Platform.select({
                  web: { boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)' },
                  default: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: 20,
                  },
                }),
                width: dimensions.width,
                top: dimensions.top,
                left: dimensions.left,
              }}
              className="bg-background-500"
            >
              {hasSuggestions && (
                <Box
                  style={{ maxHeight: 200 }}
                  className="bg-background-0 border border-outline-300 rounded-md overflow-hidden"
                >
                  <ScrollView
                    nestedScrollEnabled={true}
                    style={{ maxHeight: 200 }}
                  >
                    <VStack space="$0">
                      {filteredSuggestions.map((suggestion, index) => (
                        <Pressable
                          key={suggestion.value}
                          onPress={() => handleSuggestionSelect(suggestion)}
                        >
                          <Box
                            className={cn(
                              'px-4 py-3 border-outline-200',
                              index === activeIndex
                                ? 'bg-primary-600'
                                : 'bg-transparent',
                              index < filteredSuggestions.length - 1
                                ? 'border-b'
                                : 'border-b-0',
                            )}
                          >
                            <Text
                              className={cn(
                                'text-base',
                                index === activeIndex
                                  ? 'text-typography-0'
                                  : 'text-typography-900',
                              )}
                            >
                              {suggestion.label}
                            </Text>
                            {suggestion.description && (
                              <Text
                                className={cn(
                                  'text-sm mt-1',
                                  index === activeIndex
                                    ? 'text-typography-200'
                                    : 'text-typography-500',
                                )}
                              >
                                {suggestion.description}
                              </Text>
                            )}
                          </Box>
                        </Pressable>
                      ))}
                    </VStack>
                  </ScrollView>
                </Box>
              )}
              {showNoResults && (
                <Box className="bg-background-0 border border-outline-300 rounded-md px-4 py-3">
                  <Text className="text-typography-500 text-base text-center">
                    No results found
                  </Text>
                </Box>
              )}
            </Box>
          </Portal>
        )}
      </Box>
    </FormControl>
  );
};

export { FixedAutocomplete };
