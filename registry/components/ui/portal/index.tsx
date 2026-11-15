import type { FunctionComponent } from 'react';
import type { ViewStyle } from 'react-native';

import { Portal as ThePortal } from '@/components/z/portal';

export type PortalProps = {
  children?: any;
  style?: ViewStyle;
  isOpen?: boolean;
  isKeyboardDismissable?: boolean;
  animationPreset?: 'none' | 'fade' | 'slide';
  useRNModal?: boolean;
  useRNModalOnAndroid?: boolean;
  onRequestClose?: any;
};

// The Gluestack overlay keeps rendering after `isOpen` turns false when it was
// mounted open, because its internal `exited` flag only flips through an exit
// animation that plain children never report. A closed portal renders nothing,
// so it unmounts here regardless of its initial value.
const Portal: FunctionComponent<PortalProps> = ({ isOpen, ...props }) => {
  if (isOpen !== true) {
    return null;
  }

  return (
    <ThePortal
      {...props}
      isOpen
    />
  );
};

export { Portal };
