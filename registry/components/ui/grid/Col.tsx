import { ReactNode } from 'react';

import { cn } from '@/components/cn';
import { GridItem } from '@/components/z/grid';

export interface ColProps {
  children: ReactNode | ReactNode[];
  className?: string;
  xs?: number | string | boolean;
  sm?: number | string | boolean;
  md?: number | string | boolean;
  lg?: number | string | boolean;
  xl?: number | string | boolean;
  xl2?: number | string | boolean;
}

const makeSize = (
  prefix: string,
  size?: string | number | boolean,
  defaultValue?: string,
) => {
  let classSize = '';

  if (!size) {
    if (!prefix && defaultValue) {
      classSize = `col-span-${defaultValue}`;
    } else if (prefix && defaultValue) {
      classSize = `${prefix}:col-span-${defaultValue}`;
    }

    return classSize;
  }

  if (typeof size === 'boolean') {
    classSize = `${prefix ? `${prefix}:` : ''}col-span-12`;
  } else {
    if (typeof size === 'string') {
      classSize = size;
    }

    const sizeNumber = parseInt(size.toString(), 10);

    if (!isNaN(sizeNumber)) {
      if (sizeNumber >= 1 && sizeNumber <= 12) {
        classSize = `${prefix ? `${prefix}:` : ''}col-span-${sizeNumber}`;
      } else {
        console.error(`Col size must be between 1 and 12. Received: ${size}`);
      }
    }
  }

  return classSize;
};

const Col = (props: ColProps) => {
  const { children, className = '', xs, sm, md, lg, xl, xl2 } = props;

  const xsSize = makeSize('', xs, '12');
  const smSize = makeSize('sm', sm);
  const mdSize = makeSize('md', md);
  const lgSize = makeSize('lg', lg);
  const xlSize = makeSize('xl', xl);
  const xl2Size = makeSize('2xl', xl2);

  // if (xs) {
  //   if (typeof xs === 'boolean') {
  //     xsSize = 'col-span-12';
  //   }

  //   if (typeof xs === 'string') {
  //     xsSize = xs;
  //   }

  //   switch (xs.toString()) {
  //     case '1':
  //       xsSize = 'col-span-1';
  //       break;
  //     case '2':
  //       xsSize = 'col-span-2';
  //       break;
  //     case '3':
  //       xsSize = 'col-span-3';
  //       break;
  //     case '4':
  //       xsSize = 'col-span-4';
  //       break;
  //     case '5':
  //       xsSize = 'col-span-5';
  //       break;
  //     case '6':
  //       xsSize = 'col-span-6';
  //       break;
  //     case '7':
  //       xsSize = 'col-span-7';
  //       break;
  //     case '8':
  //       xsSize = 'col-span-8';
  //       break;
  //     case '9':
  //       xsSize = 'col-span-9';
  //       break;
  //     case '10':
  //       xsSize = 'col-span-10';
  //       break;
  //     case '11':
  //       xsSize = 'col-span-11';
  //       break;
  //     case '12':
  //       xsSize = 'col-span-12';
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // if (sm) {
  //   if (typeof sm === 'boolean') {
  //     smSize = 'sm:col-span-12';
  //   }

  //   if (typeof sm === 'string') {
  //     smSize = sm;
  //   }

  //   switch (sm.toString()) {
  //     case '1':
  //       smSize = 'sm:col-span-1';
  //       break;
  //     case '2':
  //       smSize = 'sm:col-span-2';
  //       break;
  //     case '3':
  //       smSize = 'sm:col-span-3';
  //       break;
  //     case '4':
  //       smSize = 'sm:col-span-4';
  //       break;
  //     case '5':
  //       smSize = 'sm:col-span-5';
  //       break;
  //     case '6':
  //       smSize = 'sm:col-span-6';
  //       break;
  //     case '7':
  //       smSize = 'sm:col-span-7';
  //       break;
  //     case '8':
  //       smSize = 'sm:col-span-8';
  //       break;
  //     case '9':
  //       smSize = 'sm:col-span-9';
  //       break;
  //     case '10':
  //       smSize = 'sm:col-span-10';
  //       break;
  //     case '11':
  //       smSize = 'sm:col-span-11';
  //       break;
  //     case '12':
  //       smSize = 'sm:col-span-12';
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // if (md) {
  //   if (typeof md === 'boolean') {
  //     mdSize = 'md:col-span-12';
  //   }

  //   if (typeof md === 'string') {
  //     mdSize = md;
  //   }

  //   switch (md.toString()) {
  //     case '1':
  //       mdSize = 'md:col-span-1';
  //       break;
  //     case '2':
  //       mdSize = 'md:col-span-2';
  //       break;
  //     case '3':
  //       mdSize = 'md:col-span-3';
  //       break;
  //     case '4':
  //       mdSize = 'md:col-span-4';
  //       break;
  //     case '5':
  //       mdSize = 'md:col-span-5';
  //       break;
  //     case '6':
  //       mdSize = 'md:col-span-6';
  //       break;
  //     case '7':
  //       mdSize = 'md:col-span-7';
  //       break;
  //     case '8':
  //       mdSize = 'md:col-span-8';
  //       break;
  //     case '9':
  //       mdSize = 'md:col-span-9';
  //       break;
  //     case '10':
  //       mdSize = 'md:col-span-10';
  //       break;
  //     case '11':
  //       mdSize = 'md:col-span-11';
  //       break;
  //     case '12':
  //       mdSize = 'md:col-span-12';
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // if (lg) {
  //   if (typeof lg === 'boolean') {
  //     lgSize = 'lg:col-span-12';
  //   }

  //   if (typeof lg === 'string') {
  //     lgSize = lg;
  //   }

  //   switch (lg.toString()) {
  //     case '1':
  //       lgSize = 'lg:col-span-1';
  //       break;
  //     case '2':
  //       lgSize = 'lg:col-span-2';
  //       break;
  //     case '3':
  //       lgSize = 'lg:col-span-3';
  //       break;
  //     case '4':
  //       lgSize = 'lg:col-span-4';
  //       break;
  //     case '5':
  //       lgSize = 'lg:col-span-5';
  //       break;
  //     case '6':
  //       lgSize = 'lg:col-span-6';
  //       break;
  //     case '7':
  //       lgSize = 'lg:col-span-7';
  //       break;
  //     case '8':
  //       lgSize = 'lg:col-span-8';
  //       break;
  //     case '9':
  //       lgSize = 'lg:col-span-9';
  //       break;
  //     case '10':
  //       lgSize = 'lg:col-span-10';
  //       break;
  //     case '11':
  //       lgSize = 'lg:col-span-11';
  //       break;
  //     case '12':
  //       lgSize = 'lg:col-span-12';
  //       break;
  //     default:
  //       break;
  //   }
  // }

  const isColumnSized = xsSize || smSize || mdSize || lgSize;

  return (
    <GridItem
      _extra={{
        className: cn(
          xsSize,
          smSize,
          mdSize,
          lgSize,
          xlSize,
          xl2Size,
          className,
        ),
      }}
    >
      {children}
    </GridItem>
  );
};

export default Col;
