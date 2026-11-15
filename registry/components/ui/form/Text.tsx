import { twMerge } from 'tailwind-merge';

import { Text as TheText, type TextProps } from '../text';

export type FormTextProps = TextProps & {
  muted?: boolean;
};

const Text = (props: FormTextProps) => {
  const { muted, className, ...rest } = props;

  const newClassName = twMerge(muted ? 'muted' : '', className);

  return (
    <TheText
      size="sm"
      className={newClassName}
      {...rest}
    />
  );
};

export { Text };
