/**
 * Clases de color compartidas por Button, Badge y Alert, indexadas por la
 * variante publica. Las clases son literales para que NativeWind las detecte;
 * no las compongas con plantillas (`bg-${scale}-100`).
 *
 * Las escalas se invierten en modo oscuro, asi que ninguna clase necesita
 * `dark:`. `light` y `dark` usan las superficies fijas del tema, que conservan
 * su color en ambos modos; `neutral` usa las escalas neutras.
 */

export const TONE_VARIANTS = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'dark',
  'light',
  'neutral',
] as const;

export type ToneVariant = (typeof TONE_VARIANTS)[number];

/** Variantes con relleno solido disponible. */
export type SolidVariant = 'primary' | 'danger';

export type ToneClasses = {
  /** Fondo y color del borde; el ancho del borde lo decide el componente. */
  root: string;
  /** Texto e icono sobre el fondo. */
  text: string;
};

export type OutlineClasses = {
  /** Color del borde sobre la superficie base. */
  border: string;
  /** Texto e icono sobre la superficie base. */
  text: string;
};

export function isToneVariant(variant: unknown): variant is ToneVariant {
  return (TONE_VARIANTS as readonly unknown[]).includes(variant);
}

/**
 * Receta tintada (soft): fondo `-100`, borde `-300` y texto `-700`. El texto
 * supera 7:1 sobre el fondo en ambos modos; el borde `-300` delimita el
 * componente sobre el fondo de la pagina.
 */
export const SOFT_CLASSES: Record<ToneVariant, ToneClasses> = {
  primary: {
    root: 'bg-primary-100 border-primary-300',
    text: 'text-primary-700',
  },
  secondary: {
    root: 'bg-secondary-100 border-secondary-300',
    text: 'text-secondary-700',
  },
  success: {
    root: 'bg-success-100 border-success-300',
    text: 'text-success-700',
  },
  danger: {
    root: 'bg-error-100 border-error-300',
    text: 'text-error-700',
  },
  warning: {
    root: 'bg-warning-100 border-warning-300',
    text: 'text-warning-700',
  },
  info: {
    root: 'bg-info-100 border-info-300',
    text: 'text-info-700',
  },
  dark: {
    root: 'bg-fixed-dark border-fixed-dark-hover',
    text: 'text-fixed-dark-foreground',
  },
  light: {
    root: 'bg-fixed-light border-fixed-light-border',
    text: 'text-fixed-light-foreground',
  },
  neutral: {
    root: 'bg-background-100 border-outline-300',
    text: 'text-typography-700',
  },
};

/**
 * Relleno solido para el mayor enfasis, con borde del mismo color. `primary`
 * usa `-600` con texto `typography-0`, que supera 6:1 en ambos modos (`-500`
 * no llega a 4.5:1 en modo claro). `danger` usa la superficie fija
 * `fixed-danger`, un rojo vivo que no se invierte, con texto blanco (4.8:1).
 */
export const SOLID_CLASSES: Record<SolidVariant, ToneClasses> = {
  primary: {
    root: 'bg-primary-600 border-primary-600',
    text: 'text-typography-0',
  },
  danger: {
    root: 'bg-fixed-danger border-fixed-danger',
    text: 'text-fixed-danger-foreground',
  },
};

/**
 * Contorno sobre la superficie base: borde `-500` y texto `-600`. En esta
 * receta el borde es el unico limite visible del componente, asi que supera
 * 3:1 (WCAG 1.4.11) sobre `background-0` y `background-50` en ambos modos;
 * `-400` no llegaba a 3:1. El texto supera 6:1; los pasos mas oscuros quedan
 * casi negros sobre la superficie en modo oscuro. Las variantes neutras forman
 * una escala para distinguirse: `light` (borde `outline-500`, texto
 * `typography-600`), `neutral` (`outline-600`, `typography-800`) y `dark`
 * (`background-800`, `typography-900`).
 */
export const OUTLINE_CLASSES: Record<ToneVariant, OutlineClasses> = {
  primary: { border: 'border-primary-500', text: 'text-primary-600' },
  secondary: { border: 'border-secondary-500', text: 'text-secondary-600' },
  success: { border: 'border-success-500', text: 'text-success-600' },
  danger: { border: 'border-error-500', text: 'text-error-600' },
  warning: { border: 'border-warning-500', text: 'text-warning-600' },
  info: { border: 'border-info-500', text: 'text-info-600' },
  dark: { border: 'border-background-800', text: 'text-typography-900' },
  light: { border: 'border-outline-500', text: 'text-typography-600' },
  neutral: { border: 'border-outline-600', text: 'text-typography-800' },
};

/**
 * Anillo de foco web, igual para todas las variantes: `indicator-primary`
 * contrasta mas de 6:1 con la superficie base en ambos modos.
 */
export const FOCUS_RING_CLASSES =
  'data-[focus-visible=true]:web:ring-indicator-primary';
