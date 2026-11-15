import type { ComponentProps } from 'react';
import type { Image as RNImage } from 'react-native';

import { Image as TheImage } from '@/components/z/image';

import { withFrozenProps } from '../primitive';

type ImagePrimitiveProps = ComponentProps<typeof RNImage> & {
  size?: string | number;
  alt?: string;
};

export type ImageProps = Omit<ImagePrimitiveProps, 'source'> & {
  src: string | ImagePrimitiveProps['source'];
};

const ImagePrimitive = withFrozenProps<ImagePrimitiveProps, 'size'>(TheImage);

const Image = (props: ImageProps) => {
  const { src, ...rest } = props;

  const isStringSrc = typeof src === 'string';

  return (
    <ImagePrimitive
      {...rest}
      source={isStringSrc ? { uri: src } : src}
    />
  );
};

export { Image };
