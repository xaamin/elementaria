import fs from 'node:fs';
import path from 'node:path';

/** Archivos de la raíz del proyecto que pertenecen al tema. */
export const THEME_ROOT_FILES = ['nativewind-env.d.ts'];

/** Archivo CSS del tema (solo el bloque entre marcadores). */
export const THEME_CSS = 'global.css';

/** Prefijos (relativos a la raíz del proyecto) que forman el item `base`. */
const BASE_PREFIXES = [
  'components/cn.ts',
  'components/hooks/',
  'components/lib/',
  'components/ui/primitive.ts',
  'components/ui/dom-view-props',
  'components/ui/accessibility/',
];

/** Prefijos que forman el item `theme`. */
const THEME_PREFIXES = [
  'components/ui/theme/',
  'components/z/gluestack-ui-provider/',
  ...THEME_ROOT_FILES,
];

/** Dependencias que el código no importa pero el tema necesita. */
export const THEME_EXTRA = {
  dependencies: ['nativewind', 'react-native-css', 'tailwindcss'],
  devDependencies: ['@tailwindcss/postcss'],
};

/** Paquetes que se instalan con `npx expo install` en proyectos Expo. */
export function isExpoManaged(name) {
  return (
    name === 'expo' ||
    name.startsWith('expo-') ||
    name.startsWith('@expo/') ||
    [
      'react-native-reanimated',
      'react-native-gesture-handler',
      'react-native-safe-area-context',
      'react-native-screens',
      'react-native-svg',
      'react-native-worklets',
      'react-native-web',
      'react-dom',
    ].includes(name)
  );
}

/**
 * Item del registro al que pertenece un archivo (ruta relativa a la raíz
 * del proyecto, con `/`).
 *
 * @param {string} file
 * @returns {string}
 */
export function itemOf(file) {
  if (BASE_PREFIXES.some(prefix => file.startsWith(prefix))) {
    return 'base';
  }

  if (THEME_PREFIXES.some(prefix => file.startsWith(prefix))) {
    return 'theme';
  }

  const ui = file.match(/^components\/ui\/([^/]+)\//);

  if (ui) {
    return ui[1];
  }

  const z = file.match(/^components\/z\/([^/]+)\//);

  if (z) {
    return `z/${z[1]}`;
  }

  throw new Error(`No se puede asignar ${file} a ningún item del registro.`);
}

const SPECIFIER_PATTERNS = [
  /(?:^|[\s;])(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g,
  /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g,
  /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
];

/**
 * Especificadores importados por un archivo de código.
 *
 * @param {string} source
 * @returns {string[]}
 */
export function importSpecifiers(source) {
  const withoutComments = source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

  const found = new Set();

  for (const pattern of SPECIFIER_PATTERNS) {
    for (const match of withoutComments.matchAll(pattern)) {
      found.add(match[1]);
    }
  }

  return [...found];
}

/** Nombre del paquete npm de un especificador (`@a/b/c` → `@a/b`). */
export function packageName(specifier) {
  const parts = specifier.split('/');

  if (specifier.startsWith('@')) {
    return parts.slice(0, 2).join('/');
  }

  return parts[0];
}

const RESOLVE_SUFFIXES = [
  '',
  '.tsx',
  '.ts',
  '.web.tsx',
  '.web.ts',
  '.d.ts',
  '/index.tsx',
  '/index.ts',
  '/index.web.tsx',
];

/**
 * Resuelve un especificador local a un archivo existente del registro.
 *
 * @param {string} root Raíz del registro (equivale a la raíz del proyecto).
 * @param {string} fromFile Archivo que importa, relativo a `root`.
 * @param {string} specifier
 * @returns {{ kind: 'file', file: string } | { kind: 'package', name: string } | { kind: 'builtin' } | { kind: 'missing', target: string }}
 */
export function resolveSpecifier(root, fromFile, specifier) {
  if (specifier.startsWith('node:')) {
    return { kind: 'builtin' };
  }

  let target;

  if (specifier.startsWith('@/')) {
    target = specifier.slice(2);
  } else if (specifier.startsWith('.')) {
    target = path.posix.join(path.posix.dirname(fromFile), specifier);
  } else {
    return { kind: 'package', name: packageName(specifier) };
  }

  for (const suffix of RESOLVE_SUFFIXES) {
    const candidate = target + suffix;
    const absolute = path.join(root, candidate);

    if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) {
      return { kind: 'file', file: candidate };
    }
  }

  return { kind: 'missing', target };
}

/** ¿Es un archivo de código cuyos imports se analizan? */
export function isCode(file) {
  return /\.(c|m)?(t|j)sx?$/.test(file) && !file.endsWith('.d.ts');
}

/** ¿Es un archivo de pruebas? No se distribuye. */
export function isTest(file) {
  return /\.test(\.web)?\.(t|j)sx?$/.test(file);
}

/**
 * Lista recursiva de archivos (rutas con `/`, relativas a `base`).
 *
 * @param {string} dir
 * @param {string} [base]
 * @returns {string[]}
 */
export function walk(dir, base = dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(absolute, base));
    } else if (entry.isFile() && entry.name !== '.DS_Store') {
      files.push(path.relative(base, absolute).split(path.sep).join('/'));
    }
  }

  return files.sort();
}
