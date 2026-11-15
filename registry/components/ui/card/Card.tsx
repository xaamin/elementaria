import React, {
  ComponentProps,
  ElementType,
  forwardRef,
  ReactNode,
  RefAttributes,
} from 'react';
import type { Image as RNImage } from 'react-native';

import { Image } from '@/components/z/image';

import { Heading, type HeadingProps } from '../heading';
import { HStack, type HStackProps } from '../hstack';
import { withFrozenProps } from '../primitive';
import { VStack, type VStackProps } from '../vstack';
import type { CardPrimitiveProps } from './types';

type ElementOf<Props> = Props extends RefAttributes<infer T> ? T : never;

type TheCardProps = CardPrimitiveProps;

export interface CardProps extends TheCardProps {
  as?: ElementType;
  bg?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light';
  body?: boolean;
  border?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light';
  text?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light'
    | 'white'
    | 'muted';
  className?: string;
  children: ReactNode;
}

const Card = React.forwardRef<ElementOf<VStackProps>, CardProps>(
  (props, ref) => {
    const { as = VStack } = props;
    const Tag = as;

    return (
      <Tag
        {...props}
        ref={ref}
      />
    );
  },
);

export type CardBodyProps = VStackProps;

const CardBody = React.forwardRef<
  ElementOf<VStackProps>,
  Omit<CardBodyProps, 'ref'>
>((props, ref) => {
  return (
    <VStack
      {...props}
      ref={ref}
    />
  );
});

export type CardTitleProps = HeadingProps;

const CardTitle = React.forwardRef<
  ElementOf<HeadingProps>,
  Omit<CardTitleProps, 'ref'>
>((props, ref) => {
  return (
    <Heading
      {...props}
      ref={ref}
    />
  );
});

type CardImagePrimitiveProps = ComponentProps<typeof RNImage> & {
  size?: string | number;
  alt?: string;
};

const CardImagePrimitive = withFrozenProps<CardImagePrimitiveProps, 'size'>(
  Image,
);

export interface CardImageProps extends Omit<
  CardImagePrimitiveProps,
  'source'
> {
  bsPrefix?: string;
  src: string;
  className?: string;
}

const CardImage = React.forwardRef<
  ElementOf<CardImagePrimitiveProps>,
  Omit<CardImageProps, 'ref'>
>((props, ref) => {
  const { src, ...rest } = props;

  const newProps = {
    ...rest,
    ref,
    source: { uri: src },
  };

  return <CardImagePrimitive {...newProps} />;
});

type CardStackProps = Omit<HStackProps, 'responsive'>;

export interface CardTextProps extends CardStackProps {
  as?: ElementType;
  className?: string;
  children: ReactNode | ReactNode[];
}

const CardText = forwardRef<
  ElementOf<CardStackProps>,
  Omit<CardTextProps, 'ref'>
>((props, ref) => {
  const { as = HStack, ...rest } = props;

  const Tag = as;

  return (
    <Tag
      {...rest}
      ref={ref}
    />
  );
});

export type CardActionsProps = CardStackProps;

const CardActions = (props: CardActionsProps) => {
  return <HStack {...props} />;
};

export { CardActions, CardBody, CardImage, CardText, CardTitle };

export default Object.assign(Card, {
  Body: CardBody,
  Title: CardTitle,
  Image: CardImage,
  Text: CardText,
  Footer: CardActions,
});
