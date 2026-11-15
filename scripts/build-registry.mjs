#!/usr/bin/env node
/**
 * Genera registry.json a partir de registry/.
 *
 * Cada archivo se asigna a un item (ver scripts/lib/items.mjs). Las
 * dependencias entre items y los paquetes npm se deducen de los imports.
 * Falla si un archivo importa algo que no está en el registro ni es un
 * paquete con versión declarada en package.json → elementaria.versions.
 *
 * Uso: node scripts/build-registry.mjs [--check]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  THEME_CSS,
  THEME_EXTRA,
  importSpecifiers,
  isCode,
  isExpoManaged,
  itemOf,
  resolveSpecifier,
  walk,
} from './lib/items.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY = path.join(ROOT, 'registry');
const OUTPUT = path.join(ROOT, 'registry.json');

/**
 * @param {string} registryDir
 * @param {{ version: string, peer: string[], versions: Record<string, string> }} options
 */
export function buildRegistry(registryDir, { version, peer, versions }) {
  const files = walk(registryDir).filter(file => file !== THEME_CSS);
  const items = {};
  const errors = [];

  const itemFor = name => {
    if (!items[name]) {
      items[name] = {
        files: [],
        registryDependencies: new Set(),
        dependencies: new Set(),
        devDependencies: new Set(),
      };
    }

    return items[name];
  };

  for (const file of files) {
    const name = itemOf(file);
    const item = itemFor(name);

    item.files.push(file);

    if (!isCode(file)) {
      continue;
    }

    const source = fs.readFileSync(path.join(registryDir, file), 'utf8');

    for (const specifier of importSpecifiers(source)) {
      const resolved = resolveSpecifier(registryDir, file, specifier);

      if (resolved.kind === 'file') {
        const dependency = itemOf(resolved.file);

        if (dependency !== name) {
          item.registryDependencies.add(dependency);
        }
      } else if (resolved.kind === 'package') {
        if (!peer.includes(resolved.name)) {
          item.dependencies.add(resolved.name);
        }
      } else if (resolved.kind === 'missing') {
        errors.push(`${file}: importa "${specifier}", que no está en el registro.`);
      }
    }
  }

  if (fs.existsSync(path.join(registryDir, THEME_CSS))) {
    const theme = itemFor('theme');

    theme.css = THEME_CSS;
    THEME_EXTRA.dependencies.forEach(name => theme.dependencies.add(name));
    THEME_EXTRA.devDependencies.forEach(name => theme.devDependencies.add(name));
  }

  const withVersions = names => {
    const result = {};

    for (const name of [...names].sort()) {
      if (!versions[name]) {
        errors.push(`Falta la versión de "${name}" en package.json → elementaria.versions.`);
      }

      result[name] = versions[name] ?? '*';
    }

    return result;
  };

  const output = { version, items: {} };

  for (const name of Object.keys(items).sort()) {
    const item = items[name];
    const dependencies = withVersions(item.dependencies);
    const devDependencies = withVersions(item.devDependencies);
    const expo = Object.keys({ ...dependencies, ...devDependencies }).filter(isExpoManaged);

    output.items[name] = {
      type: itemType(name),
      files: item.files,
      ...(item.css ? { css: item.css } : {}),
      registryDependencies: [...item.registryDependencies].sort(),
      dependencies,
      devDependencies,
      expo,
    };
  }

  return { registry: output, errors };
}

function itemType(name) {
  if (name === 'base' || name === 'theme') {
    return name;
  }

  if (name.startsWith('z/')) {
    return 'primitive';
  }

  return 'component';
}

function main() {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const { registry, errors } = buildRegistry(REGISTRY, {
    version: pkg.version,
    peer: pkg.elementaria.peer,
    versions: pkg.elementaria.versions,
  });

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const json = `${JSON.stringify(registry, null, 2)}\n`;

  if (process.argv.includes('--check')) {
    const current = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, 'utf8') : '';

    if (current !== json) {
      console.error('registry.json está desactualizado: ejecuta `npm run build`.');
      process.exit(1);
    }

    console.log('registry.json al día.');

    return;
  }

  fs.writeFileSync(OUTPUT, json);
  console.log(`registry.json: ${Object.keys(registry.items).length} items.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
