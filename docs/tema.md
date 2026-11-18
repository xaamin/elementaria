# Tema y tokens de color

Fuentes: [global.css](../../../global.css) y [theme](../theme/index.ts).

`components/z` contiene las plantillas v5 de Gluestack (rama `main`, ruta
`apps/starter-kit-expo/components/ui`, NativeWind 5 y Tailwind 4) descargadas
sin modificaciones. Esas plantillas usan tokens semanticos estilo shadcn
(`bg-primary`, `text-foreground`, `border-border`...), mientras que `apps/`,
`pages/` y `components/ui` usan las escalas v3 (`primary-500`,
`typography-900`, `background-0`...). `global.css` declara ambos sistemas sin
editar `components/z`.

## Piezas

| Pieza                                                                                           | Responsabilidad                                                                                                           |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [global.css](../../../global.css)                                                               | Unica fuente del tema: variables de la paleta v3 y de los tokens por modo, utilidades `@theme`, safelist.                 |
| [UIThemeProvider](../theme/UIThemeProvider.tsx) / [web](../theme/UIThemeProvider.web.tsx)       | Envuelve al `GluestackUIProvider` de `components/z`, que fija el modo (`Appearance` en nativo, clase en `<html>` en web). |
| [postcss.config.mjs](../../../postcss.config.mjs) / [metro.config.js](../../../metro.config.js) | Tailwind 4 mediante `@tailwindcss/postcss` y `withNativewind`; ya no hay `tailwind.config.js` ni `nativewind/babel`.      |

`app/_layout.tsx` usa `UIThemeProvider`; no importar el proveedor de
`components/z` directamente.

En web, `UIThemeProvider` restaura el modo previo de `<html>` al desmontarse o
cambiar de modo. Por eso se puede anidar para tematizar una pantalla montada
dentro de la app: `/docs` lo usa para su boton _Modo oscuro_ / _Modo claro_
y, al salir, la app recupera su modo. En nativo no se anida: el proveedor fija
el `Appearance` global.

## Estructura de `global.css`

1. Imports de Tailwind 4 y `nativewind/theme`, como en la plantilla v5.
2. `@source inline(...)`: equivale al antiguo `safelist`, para clases que se
   componen en tiempo de ejecucion (`bg-${color}-500`).
3. `@layer theme`: variables crudas en RGB separado por espacios
   (`--primary-500: 51 51 51`), por modo:
   - `:root`: claro por defecto;
   - `@media (prefers-color-scheme: dark)`: oscuro; NativeWind lo resuelve
     con `Appearance` en nativo;
   - `:root.dark` / `:root.light`: mayor especificidad en web, donde el
     proveedor agrega la clase del modo a `<html>`.
4. `@theme inline`: genera las utilidades (`--color-primary-500:
rgb(var(--primary-500))`, `--color-primary: rgb(var(--primary))`). Las
   variables crudas no llevan el prefijo `--color-` para no chocar con las
   variables de tema de Tailwind 4.
5. `@theme`: colores fijos, `text-2xs`, `font-extrablack`, sombras
   `hard-*`/`soft-*` y breakpoints `tablet`/`desktop`/`widescreen`.

La paleta conserva solo las escalas que usa la aplicacion. Los colores
estandar (`blue`, `gray`, `red`...) son los de Tailwind 4. Las clases
`font-roboto`/`font-jakarta`... ya no existen: su variable `--font-*` nunca se
definia, asi que el texto ya heredaba la fuente.

## Correspondencia de tokens

Cada token copia, en el mismo modo, el valor de la variable v3 indicada en el
comentario junto a su declaracion:

| Token                                                    | Variable v3                                         |
| -------------------------------------------------------- | --------------------------------------------------- |
| `background`, `card`, `popover`                          | `background-0`                                      |
| `foreground` y `card-`/`popover-`/`secondary-foreground` | `typography-900`                                    |
| `primary` / `primary-foreground`                         | `primary-500` / `typography-0`                      |
| `secondary`                                              | `secondary-100`                                     |
| `muted` / `muted-foreground`                             | `background-muted` / `typography-500`               |
| `accent` / `accent-foreground`                           | `background-50` / `typography-800`                  |
| `destructive` / `destructive-foreground`                 | `error-500` / `typography-0`                        |
| `border` / `input` / `ring`                              | `outline-200` / `outline-300` / `indicator-primary` |

Para cambiar un color, editarlo en los cuatro bloques de `@layer theme` (dos
por modo) y en los tokens que lo copian.

## Variantes de las primitivas

Las plantillas v4/v5 eliminaron o renombraron variantes (`action`, `size`,
`variant` de Button, Badge, Alert, Input, Checkbox, Avatar, Accordion...). Las
props congeladas de `components/ui` no cambian: cada wrapper las traduce a la
variante mas cercana y conserva con clases lo que la plantilla ya no ofrece,
por ejemplo los colores de exito/aviso o las alturas de `Input`. Ver
[Contratos congelados](tipos-publicos.md#contratos-congelados).

En v3 el color se elegia con `action` (`primary`, `negative`, `error`,
`muted`...) combinado con `variant` (`solid`/`outline`/`link`), y los
subcomponentes lo heredaban por `parentVariants`. Las plantillas v5 eliminaron
`action` (Toast lo conserva, pero pinta todas las acciones igual) y usan un
`variant` estilo shadcn. En `components/ui`, `Button`, `Badge`, `Alert` y
`Toast` indican el color con `variant` (equivalente a `action`) y la forma con
`outline` (`outline` o, sin ella, `solid`); no exponen `action`. Para no
cambiar la apariencia:

- Cada wrapper copia las clases de la plantilla v3
  (`git show e84226f:components/z/<componente>/index.tsx`) en una tabla por
  color y forma, y las pasa en `className`. `tva` mezcla ese `className` con
  `tailwind-merge`, por lo que sustituye las clases del mismo grupo de la
  variante v5.
- Se usa la variante v5 sin modificadores `dark:` (`default` en Button,
  Alert y Toast; `secondary` en Badge), para que no queden colores v5 en modo
  oscuro despues de la mezcla.
- Los subcomponentes (`Button.Text`/`Button.Icon`, `Badge.Text`/`Badge.Icon`,
  `Toast.Title`/`Toast.Description`, `Accordion.Item`) reciben las clases por
  un contexto React propio del wrapper, porque el contexto de estilo de
  `components/z` ya no transporta `action`.
- Valores por defecto de v3: `Badge` y `Alert` sin color usan `muted`; `Toast`
  usa `solid`/`muted`; `Accordion` usa `filled`.
- Excepcion: `Button` con `outline` (y `link`/`ghost`) refuerza la paleta v3,
  cuyos bordes `-300` y textos `-500` apenas se veian: bordes `-400`/`-500`
  (`outline-400` en `secondary`), texto e icono del color de la accion en
  `-600` (`typography-800` en `secondary`). El `secondary` solido usa borde
  `outline-300`.
- Excepcion: el `Toast` por defecto (`solid`/`muted`) conserva el estilo claro
  de la plantilla v5 (`bg-popover`); las demas acciones y `outline` usan v3.

| Componente | `variant` publico                                     | Paleta v3                                                                       |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| Button     | `primary`, `success`, `danger`; resto `secondary`     | `action` `primary`/`positive`/`negative`/`secondary` × `solid`/`outline`/`link` |
| Badge      | `success`, `warning`, `info`, `danger`; resto `muted` | `action` `success`/`warning`/`info`/`error`/`muted`                             |
| Alert      | `success`, `warning`, `info`, `danger`; resto `muted` | `action` `success`/`warning`/`info`/`error`/`muted`; `outline` claro            |
| Toast      | `success`, `warning`, `info`, `danger`; resto `muted` | Solid relleno por `action`, salvo `muted` (claro de v5); `outline` claro        |
| Link       | —                                                     | Texto `info-700`                                                                |

## Actualizar las plantillas

1. Volver a descargar `components/z` completo, sin modificarlo (para el
   proveedor, solo `index.tsx`, `index.web.tsx` y `script.ts`, como hace el CLI
   para NativeWind 5).
2. Comparar los tokens que usan las plantillas con los declarados en
   `global.css`.
3. Revisar las variantes que cambiaron y ajustar los wrappers de
   `components/ui`, sin modificar sus props publicas.
4. Llevar el cambio al registro Elementaria (ver
   [Distribucion con Elementaria](../AGENTS.md#distribucion-con-elementaria)).

El bloque del tema de `global.css` esta delimitado por los marcadores
`elementaria:theme:start` y `elementaria:theme:end`: el CLI de Elementaria lo
inserta o reemplaza en otros proyectos. Los estilos propios de la aplicacion
van fuera del bloque.
