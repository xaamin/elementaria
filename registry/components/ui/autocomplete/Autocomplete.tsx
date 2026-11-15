import { useCallback, useEffect, useRef, useState } from 'react';
import type { ComponentRef, ComponentType, ReactNode, Ref } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import type {
  FlatListProps,
  ListRenderItemInfo,
  StyleProp,
  TextInputProps,
  ViewStyle,
} from 'react-native';

import { cn } from '@/components/cn';

import type { InputRef } from '../form';
import { Input } from '../form/Input';
import { Pressable } from '../pressable';

export type AutocompleteSearchResult<Item> =
  | Item[]
  | {
      data: Item[];
      hasMore: boolean;
    };

export type AutocompleteInputProps<Item = unknown> = TextInputProps &
  Partial<Omit<FlatListProps<Item>, 'data' | 'ref'>> & {
    containerStyle?: StyleProp<ViewStyle>;
    hideResults?: boolean;
    searchOnEmpty?: boolean;
    inputContainerStyle?: StyleProp<ViewStyle>;
    listContainerStyle?: StyleProp<ViewStyle>;
    listProps?: Partial<Omit<FlatListProps<Item>, 'data' | 'renderItem'>>;
    onShowResults?: (showResults: boolean) => void;
    renderResultList?: ComponentType<
      FlatListProps<Item> & {
        ref?: Ref<FlatList<Item>>;
      }
    >;
    renderTextInput?: (
      props: TextInputProps & { ref?: Ref<InputRef> },
    ) => ReactNode;
    onSearch: (
      value: string,
      page: number,
    ) => Promise<AutocompleteSearchResult<Item>>;
    onSelect: (item: Item) => void;
    ref?: Ref<InputRef>;
  };

export type AutocompleteProps<Item = unknown> = AutocompleteInputProps<Item>;

function defaultKeyExtractor(_: unknown, index: number): string {
  return `key-${index}`;
}

function defaultRenderItem<Item>({ item }: ListRenderItemInfo<Item>) {
  return <Text>{String(item)}</Text>;
}

const Autocomplete = <Item = unknown,>(props: AutocompleteInputProps<Item>) => {
  const {
    containerStyle,
    hideResults,
    searchOnEmpty = false,
    inputContainerStyle,
    listContainerStyle,
    listProps,
    onShowResults,
    onStartShouldSetResponderCapture = () => false,
    renderResultList: ResultList = FlatList,
    renderTextInput,
    keyboardShouldPersistTaps = 'handled',
    keyExtractor = defaultKeyExtractor,
    renderItem = defaultRenderItem,
    onEndReached,
    onEndReachedThreshold = 0.2,
    style,
    onSearch,
    onSelect,
    value: controlledValue,
    defaultValue = '',
    onChangeText,
    onKeyPress,
    onFocus,
    onBlur,
    ref,
    ...textInputProps
  } = props;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [data, setData] = useState<Item[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const listRef = useRef<FlatList<Item>>(null);
  const resultsRef = useRef<ComponentRef<typeof View>>(null);
  const focused = useRef(false);
  const searchRef = useRef(onSearch);
  const request = useRef({
    keyword: '',
    page: 0,
    loading: false,
    hasMore: false,
  });
  const query = controlledValue ?? internalValue;
  const canSearch = !!query || searchOnEmpty;
  const showResults = !hideResults && isOpen && canSearch;

  useEffect(() => {
    searchRef.current = onSearch;
  }, [onSearch]);

  const loadPage = useCallback(async (page: number) => {
    const current = request.current;

    if (current.loading) {
      return;
    }

    current.loading = true;
    setLoading(true);
    setError(false);

    try {
      const result = await searchRef.current(current.keyword, page);

      if (current !== request.current) {
        return;
      }

      const items = Array.isArray(result) ? result : result.data;

      current.page = page;
      current.hasMore =
        !Array.isArray(result) && result.hasMore && items.length > 0;

      setData((previous) => (page === 1 ? items : [...previous, ...items]));
    } catch {
      if (current === request.current) {
        setError(true);
      }
    } finally {
      if (current === request.current) {
        current.loading = false;
        setLoading(false);
      }
    }
  }, []);

  const startSearch = useCallback(
    (keyword: string) => {
      request.current = {
        keyword,
        page: 0,
        loading: false,
        hasMore: false,
      };

      setData([]);
      setActiveIndex(-1);
      setError(false);
      setLoading(false);
      // Empty searches only open on demand so idle inputs never cover siblings.
      const open = !!keyword || (searchOnEmpty && focused.current);

      setIsOpen(open);

      if (open) {
        void loadPage(1);
      }
    },
    [loadPage, searchOnEmpty],
  );

  useEffect(() => {
    startSearch(query);

    return () => {
      request.current = { ...request.current, loading: false };
    };
  }, [query, startSearch]);

  useEffect(() => {
    onShowResults?.(showResults);
  }, [showResults, onShowResults]);

  useEffect(() => {
    if (activeIndex >= 0 && showResults) {
      listRef.current?.scrollToIndex({ index: activeIndex, viewPosition: 0.5 });
    }
  }, [activeIndex, showResults]);

  const closeResults = () => {
    request.current = { ...request.current, loading: false };

    setIsOpen(false);
    setLoading(false);
    setActiveIndex(-1);
  };

  const openResults = () => {
    if (request.current.keyword === query && request.current.page > 0) {
      setIsOpen(true);
    } else {
      startSearch(query);
    }
  };

  const selectItem = (item: Item) => {
    closeResults();
    onSelect(item);
  };

  const handleChangeText = (text: string) => {
    if (text === query) {
      if (!isOpen && (text || searchOnEmpty)) {
        openResults();
      }

      onChangeText?.(text);

      return;
    }

    // Invalidate immediately, before the next query effect can run.
    request.current = { ...request.current, loading: false };

    setData([]);
    setActiveIndex(-1);
    setInternalValue(text);
    onChangeText?.(text);
  };

  const handleEndReached: NonNullable<FlatListProps<Item>['onEndReached']> = (
    info,
  ) => {
    if (showResults && request.current.hasMore && !error) {
      void loadPage(request.current.page + 1);
    }

    onEndReached?.(info);
    listProps?.onEndReached?.(info);
  };

  const handleKeyPress: NonNullable<TextInputProps['onKeyPress']> = (event) => {
    onKeyPress?.(event);

    if (event.isDefaultPrevented() || hideResults) {
      return;
    }

    const { key } = event.nativeEvent;

    if (key === 'Escape' && isOpen) {
      event.preventDefault();
      closeResults();
    } else if (
      (key === 'ArrowDown' || key === 'ArrowUp') &&
      data.length > 0 &&
      isOpen
    ) {
      event.preventDefault();

      let nextIndex = activeIndex + 1;

      if (key === 'ArrowUp') {
        nextIndex =
          activeIndex < 0 ? data.length - 1 : Math.max(0, activeIndex - 1);
      } else {
        nextIndex = Math.min(nextIndex, data.length - 1);

        if (
          nextIndex === data.length - 1 &&
          request.current.hasMore &&
          !error
        ) {
          void loadPage(request.current.page + 1);
        }
      }

      setActiveIndex(nextIndex);
    } else if (key === 'Enter' && isOpen && activeIndex >= 0) {
      event.preventDefault();
      selectItem(data[activeIndex]);
    }
  };

  const inputProps: TextInputProps & { ref?: Ref<InputRef> } = {
    ...textInputProps,
    placeholder: textInputProps.placeholder ?? 'Buscar o escanear artículo',
    value: query,
    onChangeText: handleChangeText,
    onKeyPress: handleKeyPress,
    onFocus: (event) => {
      focused.current = true;

      if (!isOpen && canSearch) {
        openResults();
      }

      onFocus?.(event);
    },
    onBlur: (event) => {
      focused.current = false;

      // On web, focus moves to the pressed option; keep results open for its press.
      const { relatedTarget } = event as unknown as { relatedTarget?: unknown };
      const results = resultsRef.current as unknown as {
        contains?: (node: unknown) => boolean;
      } | null;

      const movedInside =
        !!relatedTarget &&
        typeof results?.contains === 'function' &&
        results.contains(relatedTarget);
      // Switching windows or tabs blurs the input but should keep the results.
      const windowBlurred =
        (
          globalThis as { document?: { hasFocus?: () => boolean } }
        ).document?.hasFocus?.() === false;

      if (!movedInside && !windowBlurred) {
        closeResults();
      }

      onBlur?.(event);
    },
    style,
    ref,
  };

  return (
    <View style={[{ position: 'relative', zIndex: 1 }, containerStyle]}>
      <View style={inputContainerStyle}>
        {renderTextInput && renderTextInput(inputProps)}
        {!renderTextInput && <Input {...inputProps} />}
      </View>
      {showResults && (
        <View
          ref={resultsRef}
          style={[
            {
              position: 'absolute',
              top: '100%',
              width: '100%',
              maxHeight: 450,
            },
            listContainerStyle,
          ]}
          onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
          className="bg-background-0 border border-outline-200"
        >
          <ResultList
            {...listProps}
            ref={listRef}
            data={data}
            extraData={activeIndex}
            style={[{ flexShrink: 1, maxHeight: 450 }, listProps?.style]}
            keyExtractor={keyExtractor}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            onEndReached={handleEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            onScrollToIndexFailed={(info) => {
              listRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: false,
              });

              listProps?.onScrollToIndexFailed?.(info);
            }}
            onContentSizeChange={(width, height) => {
              if (activeIndex >= 0) {
                listRef.current?.scrollToIndex({
                  index: activeIndex,
                  viewPosition: 0.5,
                });
              }

              listProps?.onContentSizeChange?.(width, height);
            }}
            renderItem={(info) => (
              <Pressable
                onPress={() => selectItem(info.item)}
                accessibilityRole="button"
                accessibilityState={{ selected: info.index === activeIndex }}
                className={cn(
                  'hover:bg-background-100',
                  info.index === activeIndex
                    ? 'bg-background-100'
                    : 'bg-background-0',
                )}
              >
                {renderItem(info)}
              </Pressable>
            )}
          />
          {loading && (
            <ActivityIndicator accessibilityLabel="Cargando resultados" />
          )}
          {!loading && !error && data.length === 0 && (
            <Text className="p-3 text-typography-500">Sin resultados</Text>
          )}
          {error && (
            <View className="p-3">
              <Text
                accessibilityRole="alert"
                className="text-error-600"
              >
                No se pudieron cargar los resultados.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void loadPage(request.current.page + 1)}
              >
                <Text className="text-primary-600">Reintentar</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export { Autocomplete };
