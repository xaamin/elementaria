#!/usr/bin/env node
/**
 * Importa los componentes de un proyecto existente al registro.
 *
 * Reemplaza registry/ con:
 * - <proyecto>/components/** (sin pruebas ni guías internas de components/ui),
 * - <proyecto>/nativewind-env.d.ts,
 * - el bloque del tema de <proyecto>/global.css (entre los marcadores
 *   `elementaria:theme:start` y `elementaria:theme:end`).
 * Copia components/ui/docs a docs/ y toma de <proyecto>/package.json las
 * versiones de los paquetes que usa el registro.
 *
 * Uso: node scripts/import.mjs <ruta-del-proyecto>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CSS_END, CSS_START } from '../cli/lib/css.mjs';
import { buildRegistry } from './build-registry.mjs';
import { THEME_CSS, THEME_ROOT_FILES, isTest, walk } from './lib/items.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY = path.join(ROOT, 'registry');
const DOCS = path.join(ROOT, 'docs');

/** Archivos de components/ que no se distribuyen. */
function excluded(file) {
  return (
    isTest(file) ||
    file === 'ui/AGENTS.md' ||
    file === 'ui/README.md' ||
    file.startsWith('ui/docs/')
  );
}

function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function main() {
  const source = process.argv[2];

  if (!source) {
    console.error('Uso: node scripts/import.mjs <ruta-del-proyecto>');
    process.exit(1);
  }

  const project = path.resolve(source);
  const components = path.join(project, 'components');
  const css = fs.readFileSync(path.join(project, THEME_CSS), 'utf8');
  const start = css.indexOf(CSS_START);
  const end = css.indexOf(CSS_END);

  if (start === -1 || end === -1 || end < start) {
    console.error(`${THEME_CSS} no tiene los marcadores ${CSS_START} … ${CSS_END}.`);
    process.exit(1);
  }

  fs.rmSync(REGISTRY, { recursive: true, force: true });

  for (const file of walk(components)) {
    if (!excluded(file)) {
      copy(path.join(components, file), path.join(REGISTRY, 'components', file));
    }
  }

  for (const file of THEME_ROOT_FILES) {
    copy(path.join(project, file), path.join(REGISTRY, file));
  }

  fs.writeFileSync(path.join(REGISTRY, THEME_CSS), `${css.slice(start, end + CSS_END.length)}\n`);

  fs.rmSync(DOCS, { recursive: true, force: true });

  for (const file of walk(path.join(components, 'ui', 'docs'))) {
    copy(path.join(components, 'ui', 'docs', file), path.join(DOCS, file));
  }

  const projectPkg = JSON.parse(fs.readFileSync(path.join(project, 'package.json'), 'utf8'));
  const declared = { ...projectPkg.devDependencies, ...projectPkg.dependencies };
  const available = new Proxy(declared, {
    // Paquetes usados pero no declarados (dependencias transitivas): se toma
    // la versión instalada en node_modules.
    get(target, name) {
      if (typeof name !== 'string' || target[name]) {
        return target[name];
      }

      const installed = path.join(project, 'node_modules', name, 'package.json');

      if (!fs.existsSync(installed)) {
        return undefined;
      }

      const { version } = JSON.parse(fs.readFileSync(installed, 'utf8'));

      console.warn(`Aviso: "${name}" no está declarado en el proyecto; se usa ^${version}.`);
      target[name] = `^${version}`;

      return target[name];
    },
  });
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const { registry, errors } = buildRegistry(REGISTRY, {
    version: pkg.version,
    peer: pkg.elementaria.peer,
    versions: available,
  });

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const used = new Set();

  for (const item of Object.values(registry.items)) {
    Object.keys(item.dependencies).forEach(name => used.add(name));
    Object.keys(item.devDependencies).forEach(name => used.add(name));
  }

  pkg.elementaria.versions = Object.fromEntries(
    [...used].sort().map(name => [name, available[name]]),
  );
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  console.log(
    `Importado desde ${project}: ${Object.keys(registry.items).length} items, ${used.size} paquetes.`,
  );
  console.log('Ejecuta `npm run build` para regenerar registry.json.');
}

main();
