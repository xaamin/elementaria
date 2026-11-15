import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { buildRegistry } from '../../scripts/build-registry.mjs';
import { hash } from './config.mjs';
import { dependencyCommands, planItems, syncItems } from './sync.mjs';

const BLOCK = "/* elementaria:theme:start */\n@import 'tailwindcss';\n/* elementaria:theme:end */";

/** Registro mínimo: base, tema, una primitiva y dos componentes encadenados. */
const REGISTRY_FILES = {
  'components/cn.ts': "import { twMerge } from 'tailwind-merge';\nexport const cn = twMerge;\n",
  'components/z/button/index.tsx': "import { View } from 'react-native';\nexport const ZButton = View;\n",
  'components/ui/button/index.tsx':
    "import { cn } from '@/components/cn';\nimport { ZButton } from '@/components/z/button';\nexport { cn, ZButton };\n",
  'components/ui/modal/index.tsx':
    "import { X } from 'lucide-react-native';\nimport { ZButton } from '../button';\nexport { X, ZButton };\n",
  'components/ui/theme/index.ts': 'export const theme = {};\n',
  'global.css': `${BLOCK}\n`,
};

const VERSIONS = {
  'lucide-react-native': '^0.510.0',
  'tailwind-merge': '^1.14.0',
  nativewind: '^5.0.0',
  'react-native-css': '^3.1.0',
  tailwindcss: '^4.3.5',
  '@tailwindcss/postcss': '^4.3.5',
};

let registryRoot;
let project;
let registry;

function write(root, files) {
  for (const [file, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), content);
  }
}

function read(file) {
  return fs.readFileSync(path.join(project, file), 'utf8');
}

function newConfig(overrides = {}) {
  return {
    aliases: { components: '@/components' },
    paths: { components: 'components', css: 'global.css' },
    installed: {},
    ...overrides,
  };
}

beforeEach(() => {
  registryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'elementaria-registry-'));
  project = fs.mkdtempSync(path.join(os.tmpdir(), 'elementaria-project-'));
  write(registryRoot, REGISTRY_FILES);

  const { registry: manifest, errors } = buildRegistry(registryRoot, {
    version: '1.0.0',
    peer: ['react', 'react-native'],
    versions: VERSIONS,
  });

  expect(errors).toEqual([]);
  registry = { ...manifest, root: registryRoot };
  fs.writeFileSync(
    path.join(project, 'package.json'),
    JSON.stringify({ dependencies: { expo: '^58.0.0', 'tailwind-merge': '^1.14.0' } }),
  );
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  fs.rmSync(registryRoot, { recursive: true, force: true });
  fs.rmSync(project, { recursive: true, force: true });
  jest.restoreAllMocks();
});

describe('build-registry', () => {
  test('deduce dependencias entre items y paquetes desde los imports', () => {
    expect(registry.items.modal).toMatchObject({
      registryDependencies: ['button'],
      dependencies: { 'lucide-react-native': '^0.510.0' },
    });
    expect(registry.items.button.registryDependencies).toEqual(['base', 'z/button']);
    expect(registry.items.theme).toMatchObject({ css: 'global.css', devDependencies: { '@tailwindcss/postcss': '^4.3.5' } });
  });

  test('rechaza imports fuera del registro', () => {
    write(registryRoot, { 'components/ui/bad/index.tsx': "import { useValidator } from '@/hooks/useValidator';\n" });

    const { errors } = buildRegistry(registryRoot, {
      version: '1.0.0',
      peer: ['react', 'react-native'],
      versions: VERSIONS,
    });

    expect(errors).toEqual([expect.stringContaining('@/hooks/useValidator')]);
  });
});

describe('add', () => {
  test('copia el item con sus dependencias y registra lo instalado', async () => {
    const config = newConfig();

    const { resolved } = await syncItems({ cwd: project, registry, config, items: ['modal'], install: false });

    expect(resolved).toEqual(['base', 'z/button', 'button', 'modal']);
    expect(read('components/ui/modal/index.tsx')).toBe(REGISTRY_FILES['components/ui/modal/index.tsx']);
    expect(read('components/cn.ts')).toBe(REGISTRY_FILES['components/cn.ts']);
    expect(Object.keys(config.installed).sort()).toEqual(['base', 'button', 'modal', 'z/button']);
  });

  test('reescribe el alias y la carpeta según la configuración', async () => {
    const config = newConfig({
      aliases: { components: '~/ui-kit' },
      paths: { components: 'src/ui-kit', css: 'global.css' },
    });

    await syncItems({ cwd: project, registry, config, items: ['button'], install: false });

    expect(read('src/ui-kit/ui/button/index.tsx')).toBe(
      "import { cn } from '~/ui-kit/cn';\nimport { ZButton } from '~/ui-kit/z/button';\nexport { cn, ZButton };\n",
    );
  });

  test('conserva un archivo modificado localmente salvo con --overwrite', async () => {
    const config = newConfig();

    await syncItems({ cwd: project, registry, config, items: ['modal'], install: false });
    fs.writeFileSync(path.join(project, 'components/ui/modal/index.tsx'), 'local\n');

    const kept = await syncItems({ cwd: project, registry, config, items: ['modal'], yes: true, install: false });

    expect(kept.summary.skipped).toEqual(['components/ui/modal/index.tsx']);
    expect(read('components/ui/modal/index.tsx')).toBe('local\n');

    await syncItems({ cwd: project, registry, config, items: ['modal'], overwrite: true, install: false });

    expect(read('components/ui/modal/index.tsx')).toBe(REGISTRY_FILES['components/ui/modal/index.tsx']);
  });

  test('actualiza sin preguntar los archivos que no se tocaron desde la instalación', async () => {
    const config = newConfig();

    await syncItems({ cwd: project, registry, config, items: ['modal'], install: false });
    write(registryRoot, { 'components/ui/modal/index.tsx': 'export const v2 = true;\n' });

    const [entry] = planItems(project, registry, config, ['modal']);

    expect(entry.status).toBe('outdated');

    await syncItems({ cwd: project, registry, config, items: ['modal'], yes: true, install: false });

    expect(read('components/ui/modal/index.tsx')).toBe('export const v2 = true;\n');
    expect(config.installed.modal.files['components/ui/modal/index.tsx']).toBe(hash('export const v2 = true;\n'));
  });

  test('inserta el bloque del tema al inicio del CSS y lo reemplaza en su lugar', async () => {
    const config = newConfig();

    fs.writeFileSync(path.join(project, 'global.css'), '#app {}\n');
    await syncItems({ cwd: project, registry, config, items: ['theme'], install: false });

    expect(read('global.css')).toBe(`${BLOCK}\n\n#app {}\n`);

    write(registryRoot, { 'global.css': BLOCK.replace('tailwindcss', 'tailwindcss/v2') });
    await syncItems({ cwd: project, registry, config, items: ['theme'], install: false });

    expect(read('global.css')).toBe(`${BLOCK.replace('tailwindcss', 'tailwindcss/v2')}\n\n#app {}\n`);
  });

  test('no escribe nada en modo --dry-run', async () => {
    const config = newConfig();

    const { summary } = await syncItems({ cwd: project, registry, config, items: ['button'], dryRun: true });

    expect(summary.written).toHaveLength(3);
    expect(fs.existsSync(path.join(project, 'components'))).toBe(false);
    expect(config.installed).toEqual({});
  });
});

describe('dependencias', () => {
  test('instala solo los paquetes que faltan, con expo install para los de Expo', () => {
    write(registryRoot, { 'components/ui/picker/index.tsx': "import 'expo-document-picker';\n" });

    const { registry: manifest } = buildRegistry(registryRoot, {
      version: '1.0.0',
      peer: ['react', 'react-native'],
      versions: { ...VERSIONS, 'expo-document-picker': '~58.0.4' },
    });

    expect(dependencyCommands(project, manifest, ['modal', 'picker', 'theme', 'base'])).toEqual([
      ['npx', 'expo', 'install', 'expo-document-picker'],
      ['npm', 'install', 'lucide-react-native@^0.510.0', 'nativewind@^5.0.0', 'react-native-css@^3.1.0', 'tailwindcss@^4.3.5'],
      ['npm', 'install', '-D', '@tailwindcss/postcss@^4.3.5'],
    ]);
  });
});
