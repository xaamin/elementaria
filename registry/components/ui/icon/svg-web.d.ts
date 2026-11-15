import type { ReactNode } from 'react';
import type { SvgProps as NativeSvgProps } from 'react-native-svg/lib/typescript/elements/Svg';

import 'react-native-svg/lib/typescript/ReactNativeSVG.web';
import 'react-native-svg/lib/typescript/web/types';

// The web entry omits SvgProps, although its Svg uses the native contract.
declare module 'react-native-svg/lib/typescript/ReactNativeSVG.web' {
  interface SvgProps extends NativeSvgProps {}
}

declare module 'react-native-svg/lib/typescript/web/types' {
  interface BaseProps {
    children?: ReactNode;
  }
}
