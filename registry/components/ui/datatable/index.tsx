import { isWeb } from '@gluestack-ui/utils/nativewind-utils';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Fragment, type ReactNode } from 'react';

import { cn } from '@/components/cn';

import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from '../../z/table';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { HStack } from '../hstack';
import { ScrollView } from '../scroll-view';
import { Text } from '../text';
import { VStack } from '../vstack';

export type DynamicProps = {
  [key: string]: unknown;
};

export type Column<T> = {
  name: string;
  dataKey: string;
  visible?: boolean;
  cell?: (value: any, item: T) => ReactNode | string;
  header?: (column: Column<T>) => ReactNode;
  onCell?: (item: T) => DynamicProps;
  onHeader?: () => DynamicProps;
};

export type DataTableProps<T> = {
  className?: string;
  columns: Column<T>[];
  data: T[];
  stripped?: boolean;
  hoverable?: boolean;
  pagination?: SimplePaginationLinksProps;
  onRow?: (item: T, index: number) => DynamicProps;
  empty?: ReactNode;
} & (
  | { rowKey?: string | ((item: T) => RowKey); rowSelection?: undefined }
  | { rowKey: string | ((item: T) => RowKey); rowSelection: RowSelection<T> }
);

export type RowKey = string | number;

export type SelectionChange<T> = {
  selectedRowKeys: RowKey[];
  selectedRows: T[];
};

export type RowSelection<T> = {
  selectedRowKeys: readonly RowKey[];
  onChange: (selection: SelectionChange<T>) => void;
  disabled?: boolean;
};

type SelectionState<T> = {
  selectedKeys: Set<RowKey>;
  allSelected: boolean;
  partiallySelected: boolean;
  disabled: boolean;
  onToggleAll: (checked: boolean) => void;
  onToggleRow: (item: T, index: number, checked: boolean) => void;
};

type TableHeadingProps<T> = {
  onHeader?: () => DynamicProps;
  columns: Column<T>[];
  selection?: SelectionState<T>;
  empty: boolean;
};

type TableRowsProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey?: string | ((item: T) => RowKey);
  stripped?: boolean;
  hoverable?: boolean;
  onRow?: (item: T, index: number) => DynamicProps;
  selection?: SelectionState<T>;
};

type TableContentProps<T> = TableRowsProps<T>;

export interface PaginationChange {
  page: number;
  perPage: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export type SimplePaginationLinksProps = {
  count: number;
  currentPage: number;
  perPage: number;
  onPaginationChange: (pagination: PaginationChange) => void;
};

const TableHeading = <T extends object>(props: TableHeadingProps<T>) => {
  const { columns, selection, empty } = props;

  const cells = [];
  const className = !isWeb ? 'w-32 z-10' : 'z-10';

  if (selection) {
    const { allSelected, partiallySelected, disabled, onToggleAll } = selection;

    cells.push(
      <TableHead
        key="table-selection"
        className="w-12"
        {...(isWeb ? {} : { useRNView: true })}
      >
        <Checkbox
          aria-label="Seleccionar todas las filas"
          accessibilityLabel="Seleccionar todas las filas"
          isChecked={allSelected}
          isIndeterminate={partiallySelected}
          isDisabled={empty || disabled}
          onChange={onToggleAll}
        />
      </TableHead>,
    );
  }

  for (const column of columns) {
    const { name, header, dataKey, onHeader } = column;
    const headerProps = !!onHeader ? onHeader() : {};

    cells.push(
      <TableHead
        key={dataKey}
        {...headerProps}
        className={cn(className, headerProps?.className as string | undefined)}
        {...(isWeb ? {} : { useRNView: !!header })}
      >
        {header?.(column) ?? name}
      </TableHead>,
    );
  }

  return (
    <TableHeader className="sticky top-0 z-10">
      <TableRow>{cells}</TableRow>
    </TableHeader>
  );
};

const getRowKey = <T extends object>(
  item: T,
  index: number,
  rowKey?: string | ((item: T) => RowKey),
): RowKey => {
  if (!rowKey) {
    return index;
  }

  let key: unknown;

  if (typeof rowKey === 'function') {
    key = rowKey(item);
  } else if (rowKey in item) {
    key = Reflect.get(item, rowKey);
  }

  if (typeof key !== 'string' && typeof key !== 'number') {
    throw new TypeError(
      'DataTable: rowKey debe producir una clave string o number.',
    );
  }

  return key;
};

const stopSelectionPropagation = (event: { stopPropagation: () => void }) => {
  event.stopPropagation();
};

const TableRows = <T extends object & { [key: string]: any }>(
  props: TableRowsProps<T>,
) => {
  const {
    columns,
    data,
    rowKey,
    stripped,
    hoverable = true,
    onRow,
    selection,
  } = props;

  const cellClassName = !isWeb ? 'w-32' : '';

  const renderRow = (item: T, index: number) => {
    const cells = [];
    const key = getRowKey(item, index, rowKey);

    if (selection) {
      const { selectedKeys, disabled, onToggleRow } = selection;

      cells.push(
        <TableData
          key="table-selection"
          className="w-12"
          {...(isWeb
            ? { onClick: stopSelectionPropagation }
            : { useRNView: true, onTouchEnd: stopSelectionPropagation })}
        >
          <Checkbox
            aria-label={`Seleccionar fila ${index + 1}`}
            accessibilityLabel={`Seleccionar fila ${index + 1}`}
            isChecked={selectedKeys.has(key)}
            isDisabled={disabled}
            onChange={(checked) => onToggleRow(item, index, checked)}
          />
        </TableData>,
      );
    }

    for (const column of columns) {
      const { cell, onCell } = column;

      const cellProps = !!onCell ? onCell(item) : {};

      cells.push(
        <TableData
          key={column.dataKey}
          className={cellClassName}
          {...cellProps}
        >
          {cell ? cell(item[column.dataKey], item) : item[column.dataKey]}
        </TableData>,
      );
    }

    let className =
      index % 2 === 0 && stripped ? 'border-b-0 bg-background-50' : '';

    if (hoverable) {
      className = `${className} hover:bg-background-50`;
    }

    const rowProps = !!onRow ? onRow(item, index) : undefined;

    if (rowProps?.onPress || rowProps?.onClick) {
      className = `${className} cursor-pointer`;
    }

    return (
      <Fragment key={key}>
        <TableRow
          {...rowProps}
          className={cn(
            className,
            rowProps?.className as string | undefined,
            'border rounded-sm',
          )}
        >
          {cells}
        </TableRow>
        <TableRow className="h-2 border-none"></TableRow>
      </Fragment>
    );
  };

  return <>{data.map(renderRow)}</>;
};

const TableContent = <T extends object>(props: TableContentProps<T>) => {
  const { columns, data, ...rest } = props;

  return (
    <TableBody>
      <TableRows
        columns={columns}
        data={data}
        onRow={props.onRow}
        {...rest}
      />
    </TableBody>
  );
};

const SimplePaginationLinks = (props: SimplePaginationLinksProps) => {
  const { perPage, currentPage, count, onPaginationChange } = props;

  const hasNextPage = count > 0 && count >= perPage;

  const prev = () => {
    if (currentPage > 1) {
      onPaginationChange({ page: currentPage - 1, perPage });
    }
  };

  const next = () => {
    if (hasNextPage) {
      onPaginationChange({ page: currentPage + 1, perPage });
    }
  };

  const total = currentPage * perPage;
  const past = (currentPage - 1) * perPage;
  const display = `${past + 1}-${past + count}`;

  return (
    <HStack className="justify-end items-center">
      <Button
        size="md"
        variant="light"
        className="p-3"
        disabled={currentPage === 1}
        accessibilityLabel="Página anterior"
        onPress={prev}
      >
        <ChevronLeft />
      </Button>
      <VStack className="px-3 justify-center">
        <Text>
          {display} de {total}
        </Text>
      </VStack>
      <Button
        size="md"
        variant="light"
        className="p-3"
        disabled={!hasNextPage}
        accessibilityLabel="Página siguiente"
        onPress={next}
      >
        <ChevronRight />
      </Button>
    </HStack>
  );
};

const DataTable = <T extends object>(props: DataTableProps<T>) => {
  const {
    className,
    columns,
    data,
    pagination,
    empty,
    rowSelection,
    rowKey,
    ...rest
  } = props;

  const { currentPage = 1 } = pagination || {};

  const isEmpty = currentPage === 1 && data?.length === 0;

  const visibleColumns = columns.filter((col) => col.visible !== false);

  let selection: SelectionState<T> | undefined;

  if (rowSelection) {
    if (!rowKey) {
      throw new TypeError('DataTable: rowSelection requiere rowKey.');
    }

    const { selectedRowKeys, onChange, disabled = false } = rowSelection;

    const selectedKeys = new Set(selectedRowKeys);
    const keys = data.map((item, index) => getRowKey(item, index, rowKey));
    const selectedCount = keys.filter((key) => selectedKeys.has(key)).length;

    const onToggleAll = (checked: boolean) => {
      if (disabled) {
        return;
      }

      onChange({
        selectedRowKeys: checked ? [...new Set(keys)] : [],
        selectedRows: checked ? [...data] : [],
      });
    };

    const onToggleRow = (item: T, index: number, checked: boolean) => {
      if (disabled) {
        return;
      }

      const nextKeys = new Set(selectedKeys);
      const key = getRowKey(item, index, rowKey);

      if (checked) {
        nextKeys.add(key);
      } else {
        nextKeys.delete(key);
      }

      onChange({
        selectedRowKeys: [...nextKeys],
        selectedRows: data.filter((_row, rowIndex) =>
          nextKeys.has(keys[rowIndex]),
        ),
      });
    };

    selection = {
      selectedKeys,
      allSelected: data.length > 0 && selectedCount === data.length,
      partiallySelected: selectedCount > 0 && selectedCount < data.length,
      disabled,
      onToggleAll,
      onToggleRow,
    };
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        className="flex-grow flex-1 overflow-x-auto"
      >
        <VStack className="flex-1">
          <Table className={cn('w-full', className)}>
            <TableHeading
              columns={visibleColumns}
              selection={selection}
              empty={data.length === 0}
            />
            <TableContent
              columns={visibleColumns}
              data={data}
              rowKey={rowKey}
              selection={selection}
              {...rest}
            />
          </Table>
          {isEmpty && empty}
        </VStack>
      </ScrollView>

      {!!pagination && !isEmpty && <SimplePaginationLinks {...pagination} />}
    </>
  );
};

export { DataTable };
