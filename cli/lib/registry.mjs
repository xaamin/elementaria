import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Raíz del paquete instalado (contiene registry/ y registry.json). */
export const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * @typedef {{
 *   type: 'base' | 'theme' | 'primitive' | 'component',
 *   files: string[],
 *   css?: string,
 *   registryDependencies: string[],
 *   dependencies: Record<string, string>,
 *   devDependencies: Record<string, string>,
 *   expo: string[],
 * }} RegistryItem
 * @typedef {{ version: string, items: Record<string, RegistryItem>, root: string }} Registry
 */

/**
 * @param {string} [root]
 * @returns {Registry}
 */
export function loadRegistry(root = PACKAGE_ROOT) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'registry.json'), 'utf8'));

  return { ...manifest, root: path.join(root, 'registry') };
}

/**
 * Items pedidos más todas sus dependencias, con las dependencias primero.
 * Acepta `z/<nombre>` para primitivas.
 *
 * @param {Registry} registry
 * @param {string[]} names
 * @returns {string[]}
 */
export function resolveItems(registry, names) {
  const ordered = [];
  const visited = new Set();

  const visit = name => {
    if (visited.has(name)) {
      return;
    }

    const item = registry.items[name];

    if (!item) {
      throw new Error(`"${name}" no existe en el registro. Usa \`elementaria list\`.`);
    }

    visited.add(name);
    item.registryDependencies.forEach(visit);
    ordered.push(name);
  };

  names.forEach(visit);

  return ordered;
}

/**
 * @param {Registry} registry
 * @param {string} file Ruta del archivo dentro de registry/.
 * @returns {Buffer}
 */
export function readRegistryFile(registry, file) {
  return fs.readFileSync(path.join(registry.root, file));
}
