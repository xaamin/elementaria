export const CSS_START = '/* elementaria:theme:start */';
export const CSS_END = '/* elementaria:theme:end */';

/**
 * Bloque del tema (marcadores incluidos) dentro de un CSS, o null.
 *
 * @param {string} css
 */
export function extractBlock(css) {
  const start = css.indexOf(CSS_START);
  const end = css.indexOf(CSS_END);

  if (start === -1 || end === -1 || end < start) {
    return null;
  }

  return css.slice(start, end + CSS_END.length);
}

/**
 * Inserta o reemplaza el bloque del tema. Si el CSS no tiene el bloque, se
 * antepone: contiene los `@import` de Tailwind, que deben ir al inicio.
 *
 * @param {string | null} css Contenido actual, o null si el archivo no existe.
 * @param {string} block Bloque con marcadores.
 */
export function upsertBlock(css, block) {
  const normalized = block.trim();

  if (css === null || css.trim() === '') {
    return `${normalized}\n`;
  }

  const current = extractBlock(css);

  if (current === null) {
    return `${normalized}\n\n${css}`;
  }

  return css.replace(current, () => normalized);
}
