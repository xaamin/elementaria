import type { ComponentType, Ref } from 'react';
import { forwardRef } from 'react';

import { platformAccessibilityProps } from './accessibility';

type ViewProps = Record<string, unknown>;

/**
 * En nativo las primitivas de `components/z` son `View` y entienden las props
 * de React Native. Solo se traducen los atributos `aria-*` a sus props
 * `accessibility*` para que el consumidor escriba cualquiera de los dos
 * formatos. La variante web traduce en sentido contrario y convierte el
 * resto de las props a atributos DOM porque alli las plantillas renderizan
 * un `div`.
 */
export function withDomViewProps<Props>(
  primitive: ComponentType<Props>,
): ComponentType<Props> {
  const Primitive = primitive as ComponentType<ViewProps>;

  const Adapted = forwardRef<unknown, ViewProps>(
    function NativeViewProps(props, ref) {
      return (
        <Primitive
          {...platformAccessibilityProps(props)}
          ref={ref as Ref<unknown>}
        />
      );
    },
  );

  Adapted.displayName = primitive.displayName ?? primitive.name;

  return Adapted as unknown as ComponentType<Props>;
}
