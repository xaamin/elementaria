import { ReactNode, useEffect, useState } from 'react';

import { cn } from '@/components/cn';

import { Pressable } from '../pressable';
import { Text } from '../text';
import { View } from '../view';

export interface Tab {
  tabKey: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  label: ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  tabs?: Tab[];
  activeTab?: string;
}

const EMPTY_TABS: Tab[] = [];

const TabItem = ({
  tab,
  isActive,
  onPress,
}: {
  tab: Omit<Tab, 'content'>;
  isActive: boolean;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      className={cn(
        'flex-row items-center gap-2 px-4 py-3 border-b-2',
        isActive ? 'border-typography-950' : 'border-transparent',
      )}
    >
      {tab.leftIcon}
      <Text
        className={cn(
          'text-sm',
          isActive
            ? 'font-semibold text-typography-950'
            : 'font-normal text-typography-600',
        )}
      >
        {tab.label}
      </Text>
      {tab.rightIcon}
    </Pressable>
  );
};

const Tabs = ({
  tabs = EMPTY_TABS,
  activeTab: initialActiveTab,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string | undefined>(
    initialActiveTab,
  );

  useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab);
    }
  }, [initialActiveTab]);

  return (
    <>
      <View
        accessibilityRole="tablist"
        className="flex-row gap-6 px-4 py-3 bg-background-0 border-b border-outline-100"
      >
        {tabs.map((tab) => (
          <TabItem
            key={tab.tabKey}
            tab={tab}
            isActive={activeTab === tab.tabKey}
            onPress={() => setActiveTab(tab.tabKey)}
          />
        ))}
      </View>

      {tabs.find((tab) => tab.tabKey === activeTab)?.content}
    </>
  );
};

export { Tabs };
