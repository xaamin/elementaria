import React from 'react';
import type { ElementType } from 'react';

import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { Heading } from '../heading';

export interface PanelOptionItem {
  iconName: ElementType;
  subText: string;
  endIcon: ElementType;
}

export interface PanelOptionsProps {
  options: PanelOptionItem[];
  title?: string;
}

const PanelOption = ({
  item,
  index,
  count,
}: {
  item: PanelOptionItem;
  index: number;
  count: number;
}) => {
  return (
    <>
      <HStack
        space="2xl"
        className="justify-between items-center w-full flex-1 py-3 px-2"
      >
        <HStack
          className="items-center"
          space="md"
        >
          <Icon
            as={item.iconName}
            className="stroke-[#747474]"
          />
          <Text size="lg">{item.subText}</Text>
        </HStack>
        <Icon as={item.endIcon} />
      </HStack>
      {count - 1 !== index && <Divider className="my-1" />}
    </>
  );
};

const PanelOptions = ({ options, title }: PanelOptionsProps) => {
  const count = options.length;

  const renderPanelOption = (item: PanelOptionItem, index: number) => {
    return (
      <PanelOption
        key={index}
        item={item}
        index={index}
        count={count}
      />
    );
  };

  return (
    <>
      {title && (
        <Heading
          className="font-roboto"
          size="xl"
        >
          {title}
        </Heading>
      )}
      <VStack className="py-2 px-4 border rounded-xl border-border-300 justify-between items-center">
        {options.map(renderPanelOption)}
      </VStack>
    </>
  );
};

export { PanelOptions };
