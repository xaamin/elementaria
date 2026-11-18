import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

/**
 * On web the Gluestack overlay requests closing when Escape is released even
 * with `isKeyboardDismissable={false}`. While `active`, the returned function
 * reports whether the current close request comes from that key.
 */
export function useEscapeCloseGuard(active: boolean) {
  const ignoreEscapeRef = useRef(false);

  const guarding = Platform.OS === 'web' && active;

  useEffect(() => {
    if (!guarding) {
      return;
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      ignoreEscapeRef.current = true;

      setTimeout(() => {
        ignoreEscapeRef.current = false;
      }, 0);
    };

    window.addEventListener('keyup', handleKeyUp, true);

    return () => {
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [guarding]);

  return () => ignoreEscapeRef.current;
}
