import type { FunctionComponent } from 'react';

/**
 * Expone una primitiva de `components/z` con un contrato congelado de UI.
 *
 * Comprueba que la primitiva acepte todas las props congeladas excepto `ref`
 * y las claves de variante indicadas en `VariantKeys`. Los creadores de
 * Gluestack declaran el ref con el tipo de sus props en lugar de la instancia
 * nativa que reciben en runtime; el contrato congelado declara esa instancia
 * real.
 *
 * Las variantes (`size`, `space`, `variant`, `action`, `orientation`…) se
 * resuelven con `tva`, cuyos tipos exigen uniones literales desde
 * `@gluestack-ui/utils` 5. El contrato las congela con un tipo más amplio y
 * en runtime `tva` ignora los valores que la plantilla no define, por lo que
 * se aceptan con su tipo congelado sin comprobarlas contra la plantilla.
 * No cambia el componente en runtime.
 */
export function withFrozenProps<Props, VariantKeys extends keyof Props = never>(
  primitive: FunctionComponent<Omit<Props, 'ref' | VariantKeys>>,
): FunctionComponent<Props> {
  return primitive as FunctionComponent<Props>;
}

/** Variantes compartidas por las primitivas de texto (`tva` de Text/Heading). */
export type TextVariantKeys =
  | 'size'
  | 'sub'
  | 'underline'
  | 'italic'
  | 'isTruncated'
  | 'bold'
  | 'strikeThrough'
  | 'highlight';

/** Variantes compartidas por las primitivas de pila (`tva` de HStack/VStack). */
export type StackVariantKeys = 'space' | 'reversed';
