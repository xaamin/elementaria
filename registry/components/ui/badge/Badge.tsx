import React, {
  ComponentProps,
  ComponentRef,
  createContext,
  forwardRef,
  ReactNode,
  useContext,
} from 'react';
import type { Text, View } from 'react-native';
import type { Svg } from 'react-native-svg';

import { cn } from '@/components/cn';
import {
  BadgeIcon as TheBadgeIcon,
  BadgeText as TheBadgeText,
  Badge as TheBadge,
} from '@/components/z/badge';

import { Box } from '../box';
import type { IconProps } from '../icon';
import { withFrozenProps } from '../primitive';
import { isToneVariant, SOFT_CLASSES, SOLID_CLASSES } from '../variants';
import type { ToneClasses } from '../variants';

type BaseBadgeProps = ComponentProps<typeof View> & {
  action?: string | number;
  variant?: string | number;
  size?: string | number;
};
export type BadgeTextProps = ComponentProps<typeof Text> & {
  size?: 'sm' | 'md' | 'lg';
  sub?: boolean;
  underline?: boolean;
  italic?: boolean;
  isTruncated?: boolean;
  bold?: boolean;
  strikeThrough?: boolean;
  highlight?: boolean;
};
export type BadgeIconProps = IconProps;

const BadgeRoot = withFrozenProps<
  BaseBadgeProps,
  'action' | 'variant' | 'size'
>(TheBadge);

const BadgeTextPrimitive = withFrozenProps<BadgeTextProps>(TheBadgeText);

const BadgeIconPrimitive = withFrozenProps<BadgeIconProps, 'size'>(
  TheBadgeIcon,
);

type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * La plantilla v5 no define variante de tamano: la escala de texto, padding e
 * icono se aplica aqui. `md` conserva las clases de la plantilla.
 */
const SIZE_CLASSES: Record<
  BadgeSize,
  { root: string; text: string; icon: string }
> = {
  sm: { root: 'px-1.5 py-0', text: 'text-2xs', icon: 'h-2.5 w-2.5' },
  md: { root: 'px-2 py-0.5', text: 'text-xs', icon: 'h-3 w-3' },
  lg: { root: 'px-2.5 py-1', text: 'text-sm', icon: 'h-3.5 w-3.5' },
};

function resolveSize(
  size: string | number | undefined,
  fallback: BadgeSize,
): BadgeSize {
  if (size === 'sm' || size === 'md' || size === 'lg') {
    return size;
  }

  return fallback;
}

/**
 * Color de texto e icono que v3 heredaba por `parentVariants` de `action`, y
 * tamano del badge; el contexto de estilo de la plantilla v5 ya no los
 * transporta.
 */
const BadgeStyleContext = createContext<{
  color?: string;
  size: BadgeSize;
}>({ size: 'md' });

// Bold text without the uppercase of the v5 template.
const TEXT_CLASSES = 'font-bold normal-case text-typography-700';

const BadgeText = forwardRef<
  ComponentRef<typeof Text>,
  Omit<BadgeTextProps, 'ref'>
>(function BadgeText({ className, size, ...props }, ref) {
  const { color, size: badgeSize } = useContext(BadgeStyleContext);

  const textSize = resolveSize(size, badgeSize);

  return (
    <BadgeTextPrimitive
      {...props}
      ref={ref}
      className={cn(
        TEXT_CLASSES,
        SIZE_CLASSES[textSize].text,
        color,
        className,
      )}
    />
  );
});

const BadgeIcon = forwardRef<Svg, Omit<BadgeIconProps, 'ref'>>(
  function BadgeIcon({ className, size, ...props }, ref) {
    const { color, size: badgeSize } = useContext(BadgeStyleContext);

    // A numeric size is forwarded to the primitive, which draws it in pixels.
    if (typeof size === 'number') {
      return (
        <BadgeIconPrimitive
          {...props}
          ref={ref}
          size={size}
          className={cn(color, className)}
        />
      );
    }

    const iconSize = resolveSize(size, badgeSize);

    return (
      <BadgeIconPrimitive
        {...props}
        ref={ref}
        className={cn(SIZE_CLASSES[iconSize].icon, color, className)}
      />
    );
  },
);

export interface BadgeProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'neutral';
  outline?: boolean;
  pill?: boolean;
  size?: BaseBadgeProps['size'];
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

type BadgeVariant = NonNullable<BadgeProps['variant']>;

// The v5 primitive no longer has `action`; colors are set through classes on
// top of its neutral `secondary` variant, whose classes have no `dark:`
// modifiers left over after merging. They come from the shared variant
// recipes: the soft recipe, except `primary`, which uses the solid fill. The
// border color only shows with `outline`; `light` always shows it.
function colorClasses(variant: BadgeVariant): ToneClasses {
  if (variant === 'primary') {
    return SOLID_CLASSES.primary;
  }

  return SOFT_CLASSES[variant];
}

// Without `variant` the badge uses the accent (`tertiary`), as v3 did.
const DEFAULT_COLOR_CLASSES: ToneClasses = {
  root: 'bg-tertiary-100 border-tertiary-300',
  text: 'text-tertiary-700',
};

const Badge: React.FC<BadgeProps> = (props) => {
  const {
    pill,
    outline,
    variant,
    size,
    className,
    containerClassName,
    ...rest
  } = props;

  const badgeSize = resolveSize(size, 'md');

  let badgeColors = DEFAULT_COLOR_CLASSES;

  // A value outside the type (from untyped data) keeps the default colors.
  if (isToneVariant(variant)) {
    badgeColors = colorClasses(variant);
  }

  const styleContext = { color: badgeColors.text, size: badgeSize };

  const newProps = {
    ...rest,
    variant: 'secondary',
    className: cn(SIZE_CLASSES[badgeSize].root, badgeColors.root, className, {
      border: outline || variant === 'light',
      'rounded-full': pill,
      'rounded-sm': !pill,
    }),
    children:
      typeof rest.children === 'string' ? (
        <BadgeText>{rest.children}</BadgeText>
      ) : (
        rest.children
      ),
  };

  return (
    <BadgeStyleContext.Provider value={styleContext}>
      <Box className={cn('flex-row', containerClassName)}>
        <BadgeRoot {...newProps} />
      </Box>
    </BadgeStyleContext.Provider>
  );
};

export default Object.assign(Badge, {
  Text: BadgeText,
  Icon: BadgeIcon,
});
