import type { ComponentProps, ComponentRef, RefAttributes } from 'react';
import { createContext, forwardRef, useContext } from 'react';
import type { Pressable, Text, TextProps, View } from 'react-native';

import { cn } from '@/components/cn';
import {
  AccordionContent as TheAccordionContent,
  AccordionHeader as TheAccordionHeader,
  AccordionItem as TheAccordionItem,
  AccordionTitleText as TheAccordionTitleText,
  AccordionTrigger as TheAccordionTrigger,
  Accordion as TheAccordion,
} from '@/components/z/accordion';

import { Divider, type DividerProps } from '../divider';
import { withFrozenProps } from '../primitive';

export type AccordionProps = ComponentProps<typeof View> & {
  type?: 'single' | 'multiple';
  isCollapsible?: boolean;
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  isDisabled?: boolean;
  variant?: string | number;
  size?: string | number;
  context?: any;
} & RefAttributes<ComponentRef<typeof View>>;

export type AccordionItemProps = Omit<
  ComponentProps<typeof View>,
  'children'
> & {
  children: any;
  value: string;
  isDisabled?: boolean;
  variant?: string | number;
} & RefAttributes<ComponentRef<typeof View>>;

export type AccordionHeaderProps = TextProps &
  RefAttributes<ComponentRef<typeof Text>>;

export type AccordionTriggerProps = Omit<
  ComponentProps<typeof Pressable>,
  'children'
> & {
  children: any;
  isDisabled?: boolean;
  isPressed?: boolean;
  isHovered?: boolean;
  isFocused?: boolean;
  isFocusVisible?: boolean;
  isExpanded?: boolean;
  toggleItem?: () => void;
};

export type AccordionTitleProps = TextProps & {
  size?: string | number;
} & RefAttributes<ComponentRef<typeof Text>>;

export type AccordionContentProps = ComponentProps<typeof View> &
  RefAttributes<ComponentRef<typeof View>>;

export type AccordionDividerProps = DividerProps;

const AccordionItemPrimitive = withFrozenProps<AccordionItemProps, 'variant'>(
  TheAccordionItem,
);

// v3 `variant` palette; the v5 template has no variants.
const ROOT_VARIANT_CLASSES: Record<string, string> = {
  filled: 'bg-white shadow-hard-2',
  unfilled: '',
};

const ITEM_VARIANT_CLASSES: Record<string, string> = {
  filled: 'bg-background-0',
  unfilled: 'bg-transparent',
};

// v3 spacing; the v5 template moves the vertical padding to the header and
// drops the horizontal padding of the trigger and the content.
const HEADER_CLASSES = 'text-md my-0 py-0';

const TRIGGER_CLASSES = 'py-3 px-4';

const CONTENT_CLASSES = 'pt-1 pb-3 px-4';

// v3 title typography; v5 uses `text-sm font-medium` without size variants.
const TITLE_CLASSES = 'font-bold';

const TITLE_SIZE_CLASSES: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

/**
 * `variant` y `size` de la raiz, que v3 heredaba a los items y titulos por
 * `parentVariants`.
 */
const AccordionVariantContext = createContext<{
  variant?: string;
  size?: string;
}>({});

const AccordionItem = forwardRef<
  ComponentRef<typeof View>,
  Omit<AccordionItemProps, 'ref'>
>(function AccordionItem({ className, ...props }, ref) {
  const { variant } = useContext(AccordionVariantContext);

  return (
    <AccordionItemPrimitive
      {...props}
      ref={ref}
      className={cn(ITEM_VARIANT_CLASSES[String(variant)], className)}
    />
  );
});

const AccordionHeaderPrimitive =
  withFrozenProps<AccordionHeaderProps>(TheAccordionHeader);

const AccordionTitleTextPrimitive = withFrozenProps<
  AccordionTitleProps,
  'size'
>(TheAccordionTitleText);

const AccordionTitleText = forwardRef<
  ComponentRef<typeof Text>,
  Omit<AccordionTitleProps, 'ref'>
>(function AccordionTitleText({ className, ...props }, ref) {
  const { size } = useContext(AccordionVariantContext);

  return (
    <AccordionTitleTextPrimitive
      {...props}
      ref={ref}
      className={cn(TITLE_CLASSES, TITLE_SIZE_CLASSES[String(size)], className)}
    />
  );
});

const AccordionContentPrimitive =
  withFrozenProps<AccordionContentProps>(TheAccordionContent);

const AccordionHeader = forwardRef<
  ComponentRef<typeof Text>,
  Omit<AccordionHeaderProps, 'ref'>
>(function AccordionHeader({ className, ...props }, ref) {
  return (
    <AccordionHeaderPrimitive
      {...props}
      ref={ref}
      className={cn(HEADER_CLASSES, className)}
    />
  );
});

const AccordionContent = forwardRef<
  ComponentRef<typeof View>,
  Omit<AccordionContentProps, 'ref'>
>(function AccordionContent({ className, ...props }, ref) {
  return (
    <AccordionContentPrimitive
      {...props}
      ref={ref}
      className={cn(CONTENT_CLASSES, className)}
    />
  );
});

const AccordionDivider = Divider;

const AccordionTriggerPrimitive =
  withFrozenProps<AccordionTriggerProps>(TheAccordionTrigger);

const AccordionRoot = withFrozenProps<AccordionProps, 'variant' | 'size'>(
  TheAccordion,
);

const AccordionTrigger = (props: AccordionTriggerProps) => {
  const children = props.children;
  let newChildren = undefined;

  if (typeof children === 'string') {
    newChildren = <AccordionTitleText>{children}</AccordionTitleText>;
  }

  return (
    <AccordionTriggerPrimitive
      {...props}
      className={cn(TRIGGER_CLASSES, props.className)}
    >
      {newChildren ?? children}
    </AccordionTriggerPrimitive>
  );
};

const BaseAccordion = ({
  children,
  variant = 'filled',
  size = 'md',
  className = 'm-5 w-[90%] shadow-none',
  ...rest
}: AccordionProps) => {
  return (
    <AccordionVariantContext.Provider
      value={{ variant: String(variant), size: String(size) }}
    >
      <AccordionRoot
        type="single"
        isCollapsible={true}
        isDisabled={false}
        {...rest}
        variant={variant}
        size={size}
        className={cn(ROOT_VARIANT_CLASSES[String(variant)], className)}
      >
        {children}
      </AccordionRoot>
    </AccordionVariantContext.Provider>
  );
};

const Accordion = Object.assign(BaseAccordion, {
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Title: AccordionTitleText,
  Content: AccordionContent,
  Divider: AccordionDivider,
});

export { Accordion };
