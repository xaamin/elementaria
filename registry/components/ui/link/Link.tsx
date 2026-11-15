import React, {
  ComponentRef,
  forwardRef,
  ReactNode,
  RefAttributes,
} from 'react';
import type { Text, TextProps } from 'react-native';

import { cn } from '@/components/cn';
import { LinkText as TheLinkText, Link as TheLink } from '@/components/z/link';

import { type TextVariantKeys, withFrozenProps } from '../primitive';

const Variants = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark',
  'outline',
];
export interface LinkProps {
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export type LinkTextProps = TextProps & {
  size?: string | number;
  sub?: string | number | boolean;
  underline?: string | number | boolean;
  italic?: string | number | boolean;
  isTruncated?: string | number | boolean;
  bold?: string | number | boolean;
  strikeThrough?: string | number | boolean;
  highlight?: string | number | boolean;
} & RefAttributes<ComponentRef<typeof Text>>;

const LinkTextPrimitive = withFrozenProps<LinkTextProps, TextVariantKeys>(
  TheLinkText,
);

// v3 link color; the v5 template uses `text-primary`.
const LINK_TEXT_CLASSES =
  'text-info-700 data-[hover=true]:text-info-600 data-[active=true]:text-info-700';

const LinkText = forwardRef<
  ComponentRef<typeof Text>,
  Omit<LinkTextProps, 'ref'>
>(function LinkText({ className, ...props }, ref) {
  return (
    <LinkTextPrimitive
      {...props}
      ref={ref}
      className={cn(LINK_TEXT_CLASSES, className)}
    />
  );
});

const Link: React.FC<LinkProps> = (props) => {
  const { children, href, to, ...rest } = props;

  if (typeof children === 'string') {
    return (
      <TheLink
        {...rest}
        href={href ?? to}
      >
        <LinkText>{children}</LinkText>
      </TheLink>
    );
  }

  return <TheLink {...rest}>{children}</TheLink>;
};

export default Object.assign(Link, {
  Text: LinkText,
});
