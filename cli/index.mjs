#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

import { CONFIG_FILE, DEFAULT_CONFIG, loadConfig, saveConfig } from './lib/config.mjs';
import { color, colorDiff } from './lib/output.mjs';
import { loadRegistry } from './lib/registry.mjs';
import { diffOf, planItems, syncItems } from './lib/sync.mjs';

const HELP = `elementaria — componentes UI que se copian a tu proyecto

Uso: npx github:xaamin/elementaria#<tag> <comando> [opciones]

Comandos:
  init                 Crea ${CONFIG_FILE} e instala la base y el tema.
  add <items...>       Copia items y sus dependencias (z/<nombre> para primitivas).
  update [items...]    Actualiza los items instalados (o los indicados).
  diff [items...]      Compara los archivos locales con el registro.
  list                 Lista los items disponibles.

Opciones:
  --cwd <ruta>         Proyecto destino (por defecto, el directorio actual).
  --overwrite          Reemplaza archivos modificados localmente sin preguntar.
  -y, --yes            No pregunta: conserva los archivos modificados localmente.
  --dry-run            Muestra lo que haría sin escribir nada.
  --no-install         No instala dependencias; solo muestra los comandos.
  --components <dir>   (init) Carpeta de componentes. Por defecto: components.
  --alias <alias>      (init) Alias de esa carpeta. Por defecto: @/components.
  --css <archivo>      (init) CSS global del tema. Por defecto: global.css.
  --summary            (diff) Solo el resumen, sin el detalle de cambios.
`;

const OPTIONS = {
  cwd: { type: 'string' },
  overwrite: { type: 'boolean', default: false },
  yes: { type: 'boolean', short: 'y', default: false },
  'dry-run': { type: 'boolean', default: false },
  install: { type: 'boolean', default: true },
  components: { type: 'string' },
  alias: { type: 'string' },
  css: { type: 'string' },
  summary: { type: 'boolean', default: false },
  help: { type: 'boolean', short: 'h', default: false },
};

async function main(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    options: OPTIONS,
    allowPositionals: true,
    allowNegative: true,
  });
  const [command, ...items] = positionals;

  if (!command || values.help || command === 'help') {
    console.log(HELP);

    return 0;
  }

  const cwd = path.resolve(values.cwd ?? process.cwd());
  const registry = loadRegistry();
  const options = {
    cwd,
    registry,
    overwrite: values.overwrite,
    yes: values.yes,
    dryRun: values['dry-run'],
    install: values.install,
  };

  if (command === 'init') {
    return init(options, values);
  }

  if (command === 'list') {
    return list(registry, loadConfig(cwd));
  }

  const config = loadConfig(cwd);

  if (!config) {
    throw new Error(`No existe ${CONFIG_FILE}. Ejecuta primero \`elementaria init\`.`);
  }

  if (command === 'add') {
    if (items.length === 0) {
      throw new Error('Indica los items a agregar, por ejemplo: elementaria add button modal');
    }

    return sync({ ...options, config, items });
  }

  if (command === 'update') {
    const targets = items.length > 0 ? items : Object.keys(config.installed);

    if (targets.length === 0) {
      throw new Error('No hay items instalados registrados en elementaria.json.');
    }

    return sync({ ...options, config, items: targets });
  }

  if (command === 'diff') {
    return diff(cwd, registry, config, items, values.summary);
  }

  throw new Error(`Comando desconocido: ${command}. Usa --help.`);
}

async function init(options, values) {
  const { cwd, registry } = options;
  let config = loadConfig(cwd);

  if (config) {
    console.log(`${CONFIG_FILE} ya existe; se conserva.`);
  } else {
    config = {
      version: registry.version,
      aliases: { components: values.alias ?? DEFAULT_CONFIG.aliases.components },
      paths: {
        components: values.components ?? DEFAULT_CONFIG.paths.components,
        css: values.css ?? DEFAULT_CONFIG.paths.css,
      },
      installed: {},
    };
  }

  checkProject(cwd, config);

  const code = await sync({ ...options, config, items: ['base', 'theme'] });

  if (!options.dryRun) {
    console.log(`
Siguientes pasos:
  1. Importa ${config.paths.css} en tu layout raíz (por ejemplo, app/_layout.tsx).
  2. Envuelve la app con UIThemeProvider de ${config.aliases.components}/ui/theme.
  3. Agrega componentes: elementaria add button modal form`);
  }

  return code;
}

/** Avisa de la configuración que el tema necesita; no modifica archivos ajenos. */
function checkProject(cwd, config) {
  const read = file => {
    const absolute = path.join(cwd, file);

    return fs.existsSync(absolute) ? fs.readFileSync(absolute, 'utf8') : null;
  };
  const warnings = [];
  const alias = config.aliases.components;

  if (alias.startsWith('@/')) {
    const tsconfig = read('tsconfig.json');

    if (!tsconfig || !tsconfig.includes('"@/*"')) {
      warnings.push(`tsconfig.json debe declarar el alias: "paths": { "@/*": ["./*"] }`);
    }
  }

  const metro = read('metro.config.js') ?? read('metro.config.cjs');

  if (!metro || !metro.includes('withNativewind')) {
    warnings.push(
      "metro.config.js debe usar NativeWind:\n" +
        "    const { withNativewind } = require('nativewind/metro');\n" +
        '    module.exports = withNativewind(config, { inlineRem: 16 });',
    );
  }

  const postcss = read('postcss.config.mjs') ?? read('postcss.config.js') ?? read('postcss.config.cjs');

  if (!postcss || !postcss.includes('@tailwindcss/postcss')) {
    warnings.push(
      "postcss.config.mjs debe usar Tailwind 4:\n    export default { plugins: { '@tailwindcss/postcss': {} } };",
    );
  }

  for (const warning of warnings) {
    console.log(`${color.yellow('Aviso:')} ${warning}`);
  }
}

async function sync(options) {
  const { config, cwd, dryRun } = options;
  const { resolved, summary, commands } = await syncItems(options);

  console.log(`\nItems: ${resolved.join(', ')}`);
  console.log(`${color.green(`${dryRun ? 'Se escribirían' : 'Escritos'}: ${summary.written.length}`)}`);
  summary.written.forEach(file => console.log(`  + ${file}`));
  console.log(color.dim(`Sin cambios: ${summary.unchanged.length}`));

  if (summary.skipped.length > 0) {
    console.log(color.yellow(`Conservados (modificados localmente): ${summary.skipped.length}`));
    summary.skipped.forEach(file => console.log(`  = ${file}`));
    console.log(color.dim('Usa `elementaria diff` para revisarlos o --overwrite para reemplazarlos.'));
  }

  if (commands.length > 0 && (dryRun || !options.install)) {
    console.log('\nDependencias por instalar:');
    commands.forEach(command => console.log(`  ${command.join(' ')}`));
  }

  if (!dryRun) {
    config.version = options.registry.version;
    saveConfig(cwd, config);
  }

  return 0;
}

function diff(cwd, registry, config, requested, summaryOnly) {
  let items = requested;

  if (items.length === 0) {
    items = Object.keys(config.installed);
  }

  if (items.length === 0) {
    // Sin registro de instalación: compara los items con algún archivo local.
    items = Object.keys(registry.items).filter(name =>
      planItems(cwd, registry, config, [name]).some(entry => entry.status !== 'missing'),
    );
  }

  const entries = planItems(cwd, registry, config, items);
  const labels = {
    missing: color.yellow('falta localmente'),
    outdated: color.cyan('cambió en el registro'),
    modified: color.red('difiere'),
  };
  const changed = entries.filter(entry => entry.status !== 'same');

  for (const entry of changed) {
    console.log(`${labels[entry.status]}: ${entry.key}`);

    if (!summaryOnly && entry.status !== 'missing') {
      console.log(`${colorDiff(diffOf(entry))}\n`);
    }
  }

  console.log(
    `\n${items.length} items, ${entries.length} archivos: ${entries.length - changed.length} iguales, ${changed.length} con diferencias.`,
  );

  return changed.length > 0 ? 1 : 0;
}

function list(registry, config) {
  const groups = { base: [], theme: [], component: [], primitive: [] };
  const titles = {
    base: 'Base',
    theme: 'Tema',
    component: 'Componentes',
    primitive: 'Primitivas (z/)',
  };

  for (const [name, item] of Object.entries(registry.items)) {
    const installed = config?.installed[name] ? color.green(' ✓') : '';

    groups[item.type].push(`${name}${installed}`);
  }

  console.log(`Elementaria ${registry.version}\n`);

  for (const [type, names] of Object.entries(groups)) {
    console.log(color.bold(titles[type]));
    console.log(`  ${names.join(', ')}\n`);
  }

  return 0;
}

main(process.argv.slice(2))
  .then(code => {
    process.exitCode = code;
  })
  .catch(error => {
    console.error(color.red(error.message));
    process.exitCode = 1;
  });
