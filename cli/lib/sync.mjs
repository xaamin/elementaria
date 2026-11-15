import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { hash, targetPath, transformContent } from './config.mjs';
import { extractBlock, upsertBlock } from './css.mjs';
import { unifiedDiff } from './diff.mjs';
import { ask, color, colorDiff, interactive } from './output.mjs';
import { readRegistryFile, resolveItems } from './registry.mjs';

/**
 * @typedef {import('./registry.mjs').Registry} Registry
 * @typedef {import('./config.mjs').Config} Config
 * @typedef {'missing' | 'same' | 'outdated' | 'modified'} Status
 * @typedef {{
 *   item: string,
 *   key: string,
 *   kind: 'file' | 'css',
 *   target: string,
 *   next: Buffer,
 *   current: Buffer | null,
 *   status: Status,
 * }} Entry
 */

const CSS_SUFFIX = '#elementaria-theme';

/**
 * Compara los archivos de los items (sin sus dependencias) con el proyecto.
 *
 * - `missing`: no existe en el proyecto.
 * - `same`: idéntico al registro.
 * - `outdated`: difiere, pero coincide con lo que se instaló la última vez
 *   (no se modificó localmente; el registro cambió).
 * - `modified`: difiere y no hay registro de instalación que lo respalde.
 *
 * @param {string} cwd
 * @param {Registry} registry
 * @param {Config} config
 * @param {string[]} items
 * @returns {Entry[]}
 */
export function planItems(cwd, registry, config, items) {
  const entries = [];

  for (const item of items) {
    const definition = registry.items[item];
    const recorded = config.installed[item]?.files ?? {};

    for (const file of definition.files) {
      const target = targetPath(config, file);
      const absolute = path.join(cwd, target);
      const current = fs.existsSync(absolute) ? fs.readFileSync(absolute) : null;
      const next = transformContent(config, file, readRegistryFile(registry, file));

      entries.push(entry(item, target, 'file', target, next, current, recorded[target]));
    }

    if (definition.css) {
      const target = config.paths.css;
      const absolute = path.join(cwd, target);
      const css = fs.existsSync(absolute) ? fs.readFileSync(absolute, 'utf8') : null;
      const block = css === null ? null : extractBlock(css);
      const next = Buffer.from(readRegistryFile(registry, definition.css).toString('utf8').trim());
      const key = `${target}${CSS_SUFFIX}`;

      entries.push(
        entry(item, key, 'css', target, next, block === null ? null : Buffer.from(block), recorded[key]),
      );
    }
  }

  return entries;
}

function entry(item, key, kind, target, next, current, recordedHash) {
  /** @type {Status} */
  let status;

  if (current === null) {
    status = 'missing';
  } else if (current.equals(next)) {
    status = 'same';
  } else if (recordedHash && recordedHash === hash(current)) {
    status = 'outdated';
  } else {
    status = 'modified';
  }

  return { item, key, kind, target, next, current, status };
}

/**
 * Instala o actualiza items y sus dependencias.
 *
 * @param {{
 *   cwd: string,
 *   registry: Registry,
 *   config: Config,
 *   items: string[],
 *   overwrite?: boolean,
 *   yes?: boolean,
 *   dryRun?: boolean,
 *   install?: boolean,
 * }} options
 */
export async function syncItems({
  cwd,
  registry,
  config,
  items,
  overwrite = false,
  yes = false,
  dryRun = false,
  install = true,
}) {
  const resolved = resolveItems(registry, items);
  const entries = planItems(cwd, registry, config, resolved);
  const summary = { written: [], unchanged: [], skipped: [] };
  let answerAll = null;

  for (const current of entries) {
    let write = current.status === 'missing' || current.status === 'outdated';

    if (current.status === 'modified') {
      if (overwrite) {
        write = true;
      } else if (answerAll !== null) {
        write = answerAll;
      } else if (!yes && !dryRun && interactive()) {
        console.log(`\n${color.yellow('Modificado localmente:')} ${current.key}`);
        console.log(colorDiff(diffOf(current)));

        const answer = await ask('¿Reemplazar con la versión del registro? (y: sí, n: no, a: todos, q: ninguno)', [
          'n',
          'y',
          'a',
          'q',
        ]);

        if (answer === 'a' || answer === 'q') {
          answerAll = answer === 'a';
        }

        write = answer === 'y' || answer === 'a';
      }
    }

    if (current.status === 'same') {
      summary.unchanged.push(current.key);
    } else if (write) {
      summary.written.push(current.key);
    } else {
      summary.skipped.push(current.key);
    }

    if (write && !dryRun) {
      writeEntry(cwd, current);
    }

    if ((write || current.status === 'same') && !dryRun) {
      const record = config.installed[current.item] ?? { version: registry.version, files: {} };

      record.version = registry.version;
      record.files[current.key] = hash(current.next);
      config.installed[current.item] = record;
    }
  }

  const commands = dependencyCommands(cwd, registry, resolved);

  if (!dryRun && install) {
    runCommands(cwd, commands);
  }

  return { resolved, summary, commands };
}

/** @param {Entry} current */
export function diffOf(current) {
  return unifiedDiff(current.current?.toString('utf8') ?? '', current.next.toString('utf8'), {
    from: `${current.key} (local)`,
    to: `${current.key} (registro)`,
  });
}

/** @param {string} cwd @param {Entry} current */
function writeEntry(cwd, current) {
  const absolute = path.join(cwd, current.target);

  fs.mkdirSync(path.dirname(absolute), { recursive: true });

  if (current.kind === 'css') {
    const css = fs.existsSync(absolute) ? fs.readFileSync(absolute, 'utf8') : null;

    fs.writeFileSync(absolute, upsertBlock(css, current.next.toString('utf8')));

    return;
  }

  fs.writeFileSync(absolute, current.next);
}

/**
 * Comandos para instalar los paquetes que faltan en el proyecto.
 *
 * @param {string} cwd
 * @param {Registry} registry
 * @param {string[]} items
 * @returns {string[][]}
 */
export function dependencyCommands(cwd, registry, items) {
  const pkgFile = path.join(cwd, 'package.json');
  const pkg = fs.existsSync(pkgFile) ? JSON.parse(fs.readFileSync(pkgFile, 'utf8')) : {};
  const present = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
  const isExpo = Boolean(present.expo);
  const expo = new Set();
  const dependencies = new Map();
  const devDependencies = new Map();

  for (const name of items) {
    const item = registry.items[name];

    for (const [dependency, range] of Object.entries(item.dependencies)) {
      if (present[dependency]) {
        continue;
      }

      if (isExpo && item.expo.includes(dependency)) {
        expo.add(dependency);
      } else {
        dependencies.set(dependency, range);
      }
    }

    for (const [dependency, range] of Object.entries(item.devDependencies)) {
      if (!present[dependency]) {
        devDependencies.set(dependency, range);
      }
    }
  }

  const manager = packageManager(cwd);
  const add = manager === 'npm' ? ['npm', 'install'] : [manager, 'add'];
  const spec = map => [...map].map(([name, range]) => `${name}@${range}`);
  const commands = [];

  if (expo.size > 0) {
    commands.push(['npx', 'expo', 'install', ...expo]);
  }

  if (dependencies.size > 0) {
    commands.push([...add, ...spec(dependencies)]);
  }

  if (devDependencies.size > 0) {
    commands.push([...add, '-D', ...spec(devDependencies)]);
  }

  return commands;
}

/** @param {string} cwd */
export function packageManager(cwd) {
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }

  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    return 'yarn';
  }

  if (fs.existsSync(path.join(cwd, 'bun.lock')) || fs.existsSync(path.join(cwd, 'bun.lockb'))) {
    return 'bun';
  }

  return 'npm';
}

/** @param {string} cwd @param {string[][]} commands */
function runCommands(cwd, commands) {
  for (const [command, ...args] of commands) {
    console.log(color.dim(`$ ${[command, ...args].join(' ')}`));

    const result = spawnSync(command, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    if (result.status !== 0) {
      throw new Error(`Falló: ${[command, ...args].join(' ')}`);
    }
  }
}
