import React from 'react';

import { Divider } from '../divider';
import { HStack } from '../hstack';
import { Text } from '../text';
import { VStack } from '../vstack';

export interface Stat {
  label: string;
  value: string | number;
}

export interface StatsProps {
  data: Stat[];
}

const Stat = ({
  item,
  index,
  count,
}: {
  item: Stat;
  index: number;
  count: number;
}) => {
  return (
    <>
      <VStack
        className="py-3 px-4 items-center"
        space="xs"
      >
        <Text className="text-dark font-roboto font-semibold justify-center items-center">
          {item.value}
        </Text>
        <Text className="text-dark text-xs font-roboto">{item.label}</Text>
      </VStack>
      {count - 1 !== index && (
        <Divider
          orientation="vertical"
          className="h-10"
        />
      )}
    </>
  );
};

const Stats = ({ data }: StatsProps) => {
  const count = data.length;

  const renderStat = (item: Stat, index: number) => {
    return (
      <Stat
        key={index}
        item={item}
        index={index}
        count={count}
      />
    );
  };

  return <HStack className="items-center gap-1">{data.map(renderStat)}</HStack>;
};

export { Stats };
