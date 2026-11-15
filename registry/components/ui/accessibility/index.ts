// Accesibilidad entre plataformas: los consumidores pueden escribir
// `aria-*` (web) o `accessibility*` (React Native) y `platformAccessibilityProps`
// los convierte al formato de la plataforma actual (`convert.ts` en Android
// e iOS, `convert.web.ts` en web).
export { accessibleName } from './accessibleName';
export type { AccessibleNameProps } from './accessibleName';
export { platformAccessibilityProps } from './convert';
