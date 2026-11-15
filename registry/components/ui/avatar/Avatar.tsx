import type { ComponentProps, ReactNode } from 'react';
import type { Image, Text, View } from 'react-native';

import { cn } from '@/components/cn';
import {
  AvatarBadge as TheAvatarBadge,
  AvatarFallbackText as TheAvatarFallbackText,
  AvatarImage as TheAvatarImage,
  Avatar as TheAvatar,
} from '@/components/z/avatar';

import { withFrozenProps } from '../primitive';

export type AvatarImageProps = ComponentProps<typeof Image>;
export type AvatarFallbackTextProps = ComponentProps<typeof Text> & {
  size?: string | number;
};
export type AvatarBadgeProps = ComponentProps<typeof View> & {
  size?: string | number;
};
type AvatarRootProps = ComponentProps<typeof View> & {
  size?: string | number;
};
export type AvatarProps = AvatarRootProps & {
  src?: string | AvatarImageProps['source'];
  text?: ReactNode;
  alt?: string;
  badge?: string;
  textClassName?: string;
};

const AvatarRoot = withFrozenProps<AvatarRootProps, 'size'>(TheAvatar);

const AvatarImage = withFrozenProps<AvatarImageProps>(TheAvatarImage);

const AvatarFallbackText = withFrozenProps<AvatarFallbackTextProps, 'size'>(
  TheAvatarFallbackText,
);

const AvatarBadge = withFrozenProps<AvatarBadgeProps, 'size'>(TheAvatarBadge);

// The v4 primitive has a single size; the frozen `size` keeps the v3
// dimensions of the avatar, its fallback text and its badge.
const SIZE_CLASSES: Record<
  string,
  { root: string; text: string; badge: string }
> = {
  xs: { root: 'w-6 h-6', text: 'text-2xs', badge: 'w-2 h-2' },
  sm: { root: 'w-8 h-8', text: 'text-xs', badge: 'w-2 h-2' },
  md: { root: 'w-12 h-12', text: 'text-base', badge: 'w-3 h-3' },
  lg: { root: 'w-16 h-16', text: 'text-xl', badge: 'w-4 h-4' },
  xl: { root: 'w-24 h-24', text: 'text-3xl', badge: 'w-6 h-6' },
  '2xl': { root: 'w-32 h-32', text: 'text-5xl', badge: 'w-8 h-8' },
};

const EnhancedAvatar = (props: AvatarProps) => {
  const {
    src,
    text,
    badge,
    children,
    textClassName,
    alt,
    size = 'md',
    className,
    ...rest
  } = props;

  const sizeClasses = SIZE_CLASSES[String(size)] ?? SIZE_CLASSES.md;

  const isStringSrc = typeof src === 'string';

  return (
    <AvatarRoot
      {...rest}
      className={cn(sizeClasses.root, className)}
    >
      {!!src && (
        <AvatarImage
          source={isStringSrc ? { uri: src } : src}
          alt={alt}
        />
      )}

      {!!text && (
        <AvatarFallbackText className={cn(sizeClasses.text, textClassName)}>
          {text}
        </AvatarFallbackText>
      )}

      {!!badge && (
        <AvatarBadge className={cn(sizeClasses.badge, `bg-${badge}-500`)} />
      )}

      {children}
    </AvatarRoot>
  );
};

const Avatar = Object.assign(EnhancedAvatar, {
  Image: AvatarImage,
  Text: AvatarFallbackText,
  Badge: AvatarBadge,
});

export { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage };
