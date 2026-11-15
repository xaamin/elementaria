# Elementaria

Componentes UI para Expo y React Native (NativeWind 5, Tailwind 4 y Gluestack v5)
que **se copian a tu proyecto como código fuente**, al estilo de `gluestack-ui add`
o shadcn. No es una dependencia compilada: los archivos quedan en tu repositorio y
puedes editarlos; el CLI te avisa cuando difieren del registro.

## Uso

El paquete no se publica en npm; se ejecuta desde GitHub fijando un tag:

```bash
npx github:xaamin/elementaria#v0.1.0 init
npx github:xaamin/elementaria#v0.1.0 add button modal form
```

Recomendado: un script en el `package.json` del proyecto para fijar la versión.

```json
{ "scripts": { "ui": "npx github:xaamin/elementaria#v0.1.0" } }
```

```bash
npm run ui -- add datatable
npm run ui -- diff
```

Si el repositorio es privado, `npx` usa tus credenciales de git (SSH o helper de HTTPS).

### Comandos

| Comando             | Descripción                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| `init`              | Crea `elementaria.json`, copia la base y el tema, e inserta el bloque del tema en `global.css`.      |
| `add <items...>`    | Copia items con sus dependencias e instala los paquetes que falten. Primitivas: `z/<nombre>`.        |
| `update [items...]` | Vuelve a sincronizar los items instalados con la versión del tag en ejecución.                       |
| `diff [items...]`   | Compara los archivos locales con el registro. Sale con código 1 si hay diferencias.                  |
| `list`              | Lista los items (✓ = instalado).                                                                     |

Opciones: `--cwd`, `--overwrite`, `-y/--yes`, `--dry-run`, `--no-install`, `--summary` (diff),
y para `init`: `--components <dir>`, `--alias <alias>`, `--css <archivo>`.

### Archivos modificados localmente

- Archivo inexistente: se copia.
- Archivo sin cambios locales desde la última instalación: se actualiza sin preguntar.
- Archivo modificado localmente: se muestra el diff y se pregunta. Con `-y` se conserva; con
  `--overwrite` se reemplaza. Nunca se hacen merges automáticos.

`elementaria.json` guarda el hash de cada archivo instalado para distinguir
"lo modifiqué yo" de "cambió en el registro".

## Requisitos del proyecto

- Expo con `metro.config.js` usando `withNativewind` y `postcss.config.mjs` con `@tailwindcss/postcss`.
- Alias para la carpeta de componentes (por defecto `@/components` → `components/`).
- El layout raíz importa `global.css` y envuelve la app con `UIThemeProvider` (`components/ui/theme`).

`init` comprueba estos puntos y avisa; no modifica configuraciones ajenas.

## Estructura del registro

```
registry/
  components/
    cn.ts, hooks/, lib/            base
    ui/<componente>/               componentes con contrato propio (props congeladas)
    ui/theme/, z/gluestack-ui-provider/  tema
    z/<primitiva>/                 plantillas Gluestack v5 sin modificar
  global.css                       bloque del tema (entre marcadores)
  nativewind-env.d.ts
registry.json                      manifiesto generado: archivos, dependencias e items requeridos
docs/                              guías de uso y catálogo de tipos públicos
```

Las reglas de contrato y uso de los componentes están en [docs/](docs/tipos-publicos.md).

## Mantenimiento

```bash
npm ci
npm run build     # regenera registry.json a partir de registry/
npm run check     # falla si registry.json está desactualizado
npm test
```

- `build` asigna cada archivo a un item y deduce las dependencias de sus imports. Falla si un
  componente importa algo fuera del registro (por ejemplo, un hook de la aplicación): así el
  registro se mantiene autocontenido.
- Las versiones de los paquetes npm se declaran en `package.json` → `elementaria.versions`.
- Para importar los componentes de un proyecto existente (reemplaza `registry/` y `docs/`):
  `npm run import -- ../mi-proyecto`. El `global.css` del proyecto debe tener los marcadores
  `/* elementaria:theme:start */` y `/* elementaria:theme:end */`.

### Publicar una versión

1. Actualiza `version` en `package.json` y ejecuta `npm run build`.
2. Commit y tag con la misma versión: `git tag v0.2.0 && git push --tags`.
3. En los proyectos: cambia el tag del script `ui` y ejecuta `npm run ui -- update`.
