import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const CONFIG_FILE = 'elementaria.json';

export const DEFAULT_CONFIG = {
  aliases: { components: '@/components' },
  paths: { components: 'components', css: 'global.css' },
};

const REGISTRY_ALIAS = '@/components';
const REGISTRY_DIR = 'components';
const TEXT_FILE = /\.(c|m)?(t|j)sx?$|\.(css|json|md)$/;

/**
 * @typedef {{
 *   version?: string,
 *   aliases: { components: string },
 *   paths: { components: string, css: string },
 *   installed: Record<string, { version: string, files: Record<string, string> }>,
 * }} Config
 */

/**
 * @param {string} cwd
 * @returns {Config | null}
 */
export function loadConfig(cwd) {
  const file = path.join(cwd, CONFIG_FILE);

  if (!fs.existsSync(file)) {
    return null;
  }

  const config = JSON.parse(fs.readFileSync(file, 'utf8'));

  return {
    ...config,
    aliases: { ...DEFAULT_CONFIG.aliases, ...config.aliases },
    paths: { ...DEFAULT_CONFIG.paths, ...config.paths },
    installed: config.installed ?? {},
  };
}

/**
 * @param {string} cwd
 * @param {Config} config
 */
export function saveConfig(cwd, config) {
  const sortedInstalled = Object.fromEntries(
    Object.keys(config.installed)
      .sort()
      .map(name => [name, config.installed[name]]),
  );

  fs.writeFileSync(
    path.join(cwd, CONFIG_FILE),
    `${JSON.stringify({ ...config, installed: sortedInstalled }, null, 2)}\n`,
  );
}

/**
 * Ruta en el proyecto (relativa a cwd) de un archivo del registro.
 *
 * @param {Config} config
 * @param {string} file
 */
export function targetPath(config, file) {
  if (file === REGISTRY_DIR || file.startsWith(`${REGISTRY_DIR}/`)) {
    return path.posix.join(config.paths.components, file.slice(REGISTRY_DIR.length + 1));
  }

  return file;
}

/**
 * Contenido adaptado al proyecto: reescribe el alias `@/components`.
 *
 * @param {Config} config
 * @param {string} file
 * @param {Buffer} content
 * @returns {Buffer}
 */
export function transformContent(config, file, content) {
  const alias = config.aliases.components.replace(/\/$/, '');

  if (alias === REGISTRY_ALIAS || !TEXT_FILE.test(file)) {
    return content;
  }

  const text = content
    .toString('utf8')
    .replace(/(['"])@\/components(?=['"/])/g, (_match, quote) => `${quote}${alias}`);

  return Buffer.from(text, 'utf8');
}

/** @param {Buffer | string} content */
export function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}
