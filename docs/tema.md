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
   (`--primary-500: 17 132 163`), por modo:
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

La paleta parte de la propuesta de shadcn: `primary` (azul petróleo),
`accent` (azul lavanda, en la escala v3 `tertiary`), `neutral` (para
`typography`, `outline` y `background`) y los estados `success`, `warning`,
`error` e `info`. `secondary` es un gris pizarra propio, en lugar del rosa de
la propuesta, que se confundia con `error`: en OKLCH usa el tono de
`primary-500` (222.8°), la luminosidad de cada paso de `neutral` y un croma
de 0.006 a 0.036 (maximo en `500`). Cada escala v3 va del paso `50` al
`950` de la paleta en claro; el paso `0` es la mezcla al 50 % del paso `50`
con blanco (`background-0` es blanco). `info` es un azul propio que se
distingue de `primary`: conserva la luminosidad y la saturacion HSL de cada
paso de la escala `info` de la propuesta, con el tono en 218° (la propuesta
quedaba a unos 10° de `primary`). En oscuro, cada escala se invierte
(`0` ↔ `950`, `50` ↔ `900`, `100` ↔ `800`...), por lo que las clases v3 fijas
mantienen el contraste.

Cada token copia, en el mismo modo, el valor de la variable v3 indicada en el
comentario junto a su declaracion. Como los tokens reproducen los valores de
shadcn y las escalas se invierten, algunos cambian de variable segun el modo:

| Token                                       | Claro                                 | Oscuro                                |
| ------------------------------------------- | ------------------------------------- | ------------------------------------- |
| `background`                                | `background-50`                       | `background-0`                        |
| `card`, `popover`                           | `background-50`                       | `background-50`                       |
| `foreground` y `card-`/`popover-foreground` | `typography-950`                      | `typography-900`                      |
| `primary` / `primary-foreground`            | `primary-600` / `primary-50`          | `primary-400` / `primary-900`         |
| `secondary` / `secondary-foreground`        | `secondary-100` / `secondary-900`     | `secondary-100` / `secondary-900`     |
| `muted` / `muted-foreground`                | `background-muted` / `typography-500` | `background-muted` / `typography-500` |
| `accent` / `accent-foreground`              | `tertiary-100` / `tertiary-900`       | `tertiary-100` / `tertiary-900`       |
| `destructive` / `destructive-foreground`    | `error-600` / `error-50`              | `error-400` / `error-900`             |
| `border` / `input`                          | `outline-200`                         | `outline-100`                         |
| `ring`                                      | `indicator-primary`                   | `indicator-primary`                   |

Variables sin escala: `background-muted` es `neutral-100` en claro y
`neutral-800` en oscuro; `background-error`/`-warning`/`-success`/`-info` usan
el paso `0` en claro y el paso `800` de la paleta clara en oscuro;
`indicator-primary` es `primary-600` (claro) / `primary-500` (oscuro),
`indicator-info` `info-400` / `info-700` e `indicator-error` `error-600`.

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
- Recetas de variantes: Button, Badge y Alert toman sus colores de
  [variants/colors.ts](../variants/colors.ts), con clases literales indexadas
  por la variante publica y escalas invertidas (sin `dark:`):
  - `SOFT_CLASSES` (tintado): fondo `-100`, borde `-300` y texto `-700`
    (mas de 7:1). `neutral` usa `background-100`, `outline-300` y
    `typography-700`.
  - `SOLID_CLASSES` (relleno): `primary` con fondo y borde `-600` y texto
    `typography-0` (mas de 6:1 en ambos modos; `-500` no llega a 4.5:1 en
    modo claro); `danger` con la superficie fija `fixed-danger`, un rojo
    atardecer vivo (`#d92d20`, `-hover`, `-active` y texto blanco, 4.8:1) que
    la escala `error`, desaturada, no ofrece.
  - `OUTLINE_CLASSES`: superficie base con borde `-500` y texto `-600`
    (`light` usa `outline-500`/`typography-600` y `neutral`,
    `outline-600`/`typography-800`, para distinguirse entre si). Como el borde es el unico limite visible, supera 3:1 (WCAG
    1.4.11) sobre `background-0` y `background-50` en ambos modos; `-400`
    quedaba por debajo.
  - `FOCUS_RING_CLASSES`: anillo de foco `indicator-primary` (mas de 6:1 con
    la superficie base) en todas las variantes.
- Enfasis: Button usa el relleno solido en `primary` y `danger`, las acciones
  de mayor enfasis y las destructivas, y el tintado en las demas. Badge y
  Alert usan el tintado, salvo `primary`, que usa el relleno (en Alert,
  tambien en el titulo). Button agrega los estados: oscurece un paso fondo,
  borde y texto al pasar el cursor y al pulsar. Todos los botones usan
  `rounded-lg`. El texto de `Badge` va en negrita y, sin color, usa
  `tertiary` (el acento); su borde solo se ve con `outline` (y en `light`).
- Superficies fijas: las variantes `dark` y `light` de Button, Badge y Alert
  usan los colores `fixed-dark` y `fixed-light` (con `-hover`, `-active`,
  `-foreground` y, en `light`, `-border`/`-border-hover`), declarados en el
  bloque `@theme` con los valores claros de la escala neutral. No se
  invierten, asi que `dark` es oscuro y `light` claro en ambos modos. No usar
  `dark:`: en web Tailwind lo resuelve con `prefers-color-scheme` y no sigue la
  clase `.dark` que aplica el proveedor. Los campos de texto
  (`InputRoot`) usan `rounded-lg`, fondo `background-0`, borde `outline-300` y
  foco `primary-500` con anillo `primary-200`.
- Excepcion: el `Toast` por defecto (`solid`/`muted`) conserva el estilo claro
  de la plantilla v5 (`bg-popover`); las demas acciones y `outline` usan v3.

| Componente | `variant` publico                                                                                                | Paleta v3                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Button     | `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `dark`, `neutral`; resto `neutral`               | Clases por `variant` × `solid`/`outline`/`link`; `light` fijo            |
| Badge      | `primary`, `secondary`, `success`, `warning`, `info`, `danger`, `light`, `dark`, `neutral`; sin valor `tertiary` | Clases por `variant`; `light`/`dark` fijos                               |
| Alert      | `primary`, `secondary`, `success`, `warning`, `info`, `danger`, `light`, `dark`, `neutral`; resto `neutral`      | Clases por `variant`; `light`/`dark` fijos; `outline` claro              |
| Toast      | `success`, `warning`, `info`, `danger`; resto `muted`                                                            | Solid relleno por `action`, salvo `muted` (claro de v5); `outline` claro |
| Link       | —                                                                                                                | Texto `info-700`                                                         |

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
