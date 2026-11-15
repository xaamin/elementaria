# Layout y contenido

[Indice general](../README.md)

## Primitivas de disposicion

Estos exports no agregan logica de negocio. Los `index.tsx` de `ui` apuntan a
las primitivas indicadas:

| Import desde `@/components/ui/` | Base / uso                                                             |
| ------------------------------- | ---------------------------------------------------------------------- |
| `box` -> `Box`                  | [z/box](../../z/box/index.tsx), `View` con estilos base y `className`. |
| `view` -> `View`                | [z/view](../../z/view/index.tsx), reexport de `View` de React Native.  |
| `hstack` -> `HStack`            | [z/hstack](../../z/hstack/index.tsx), fila flex.                       |
| `vstack` -> `VStack`            | [z/vstack](../../z/vstack/index.tsx), columna flex.                    |
| `center` -> `Center`            | [z/center](../../z/center/index.tsx), centra en ambos ejes.            |

Hay variantes `index.web.tsx`: `Box`, `HStack`, `VStack` y `Center`
representan **div DOM en web**, y View de React Native en nativo.
Sus tipos/refs siguen esa base: eventos y atributos DOM en web frente a
props de `View` como `onLayout` en nativo. `View` de `ui/view` sigue siendo
el reexport de React Native tambien en web.
Los wrappers Gluestack agregan estilos NativeWind y refs.
`Box` no interpreta automaticamente APIs de otros sistemas como `bg="$..."`.
Preferir `className="bg-background-0"` o props soportadas por la base.

`HStack` y `VStack` admiten `space` y `reversed`. En `HStack`,
`responsive={true}` renderiza `VStack` cuando el ancho es menor que 640 px
(breakpoint `sm`) y mantiene `HStack` desde 640 px; por defecto es `false`.
La escala compartida de `space` es:

| `space` | Clase   |
| ------- | ------- |
| `xs`    | `gap-1` |
| `sm`    | `gap-2` |
| `md`    | `gap-3` |
| `lg`    | `gap-4` |
| `xl`    | `gap-5` |
| `2xl`   | `gap-6` |
| `3xl`   | `gap-7` |
| `4xl`   | `gap-8` |

`reversed` invierte la direccion de la fila/columna. No hay `space` por
defecto. La alineacion y crecimiento se expresan con clases:

```tsx
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

<VStack
  className="flex-1 p-4 bg-background-0"
  space="lg"
>
  <HStack
    className="items-center justify-between"
    space="md"
  >
    <Text className="flex-1">Contenido</Text>
    <Text size="sm">Detalle</Text>
  </HStack>
</VStack>;
```

Los contenedores no envuelven texto libre: usar `Text` dentro de
`View`, `Box`, stacks y `Pressable`. Elegir `HStack`/`VStack` para expresar
direccion; no crear wrappers locales solo para repetir `flex-row` y `gap`.

## ScrollView, FlatList y SafeAreaView

Fuentes: [scroll-view](../scroll-view/index.tsx),
[flat-list](../flat-list/index.tsx),
[safe-area-view](../safe-area-view/index.tsx).

Son reexports **directos de React Native**, no listas de negocio ni versiones
con estado remoto:

- `ScrollView`: props nativas como `contentContainerStyle`, `horizontal`,
  `showsVerticalScrollIndicator`. Usar `style`/`className` para el viewport
  y `contentContainerStyle` para el contenido. Requiere altura acotada para
  un scroll vertical util.
- `FlatList<T>`: `data`, `renderItem`, `keyExtractor`, vacio, cabeceras y demas
  props nativas. Elegirla cuando se necesita virtualizacion; `DataTable`
  y `Stats` no virtualizan.
- `SafeAreaView`: es la de `react-native`, **no** la de
  `react-native-safe-area-context`; no acepta por este wrapper una API
  adicional de `edges` o insets. No suponer proteccion uniforme en Android.

No agregan carga, errores, filtros ni paginacion. Mantener esas decisiones
en el layout o modulo consumidor.

## Grid, Row y Col

Fuentes: [Grid](../grid/Grid.tsx), [Row](../grid/Row.tsx),
[Col](../grid/Col.tsx).

```tsx
import { Input } from '@/components/ui/form';
import { Col, Row } from '@/components/ui/grid';

<Row gap={4}>
  <Col
    xs={12}
    md={6}
  >
    <Input label="Nombre" />
  </Col>
  <Col
    xs={12}
    md={6}
  >
    <Input label="Email" />
  </Col>
</Row>;
```

El barrel exporta `Grid`, `Row`, `Col`. Tambien existen `Grid.Row` y `Grid.Col`.
`Grid` y `Row` configuran la primitiva como una malla de **12 columnas**
mediante `_extra.className="grid-cols-12"`.

| Componente / prop                 | Comportamiento                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| `Grid.gap`                        | Numero, por defecto `2`; construye `gap-${gap}`.                                     |
| `Grid.className`                  | Se combina con `gap-${gap}`; un `gap-*` propio prevalece sobre `gap`.                |
| Resto de props                    | Se reenvian despues de las props base; pueden reemplazar `_extra` completo.          |
| `Row.gap`                         | Por defecto `2`; agrega `pb-${gap}` al View externo y gap a la malla interior.       |
| `Row.className`                   | Malla interior, no View externo; se combina con `gap-${gap}` y su `gap-*` prevalece. |
| `rowGap`, `columnGap`, `padding*` | Numericas; ver la nota sobre props de medicion. No agregan espacio visual.           |
| `Col.xs`                          | Span base, por defecto 12.                                                           |
| `Col.sm`, `md`, `lg`, `xl`, `xl2` | Spans por breakpoint; `xl2` genera prefijo `2xl`.                                    |
| Span numerico o string numerico   | De 1 a 12. Fuera de rango registra error en consola.                                 |
| Span booleano `true`              | Equivale a 12 columnas, no a ancho automatico.                                       |
| Span string no numerico           | Se usa como clase literal; no se agrega automaticamente el prefijo responsive.       |
| `Col.className`                   | Se combina con spans en `GridItem._extra.className`.                                 |

`Col` no reenvia props arbitrarias al item: solo consume hijos, clases y spans.
Un `0`/`false` no representa una columna oculta: en xs vuelve al default 12
y en otros breakpoints no agrega clase, por lo que hereda el span menor.

Un `className` en `Grid` o `Row` se combina con la clase calculada
`gap-${gap}` (con `tailwind-merge`): la malla conserva la separacion de `gap`
y un `gap-*` del consumidor la sustituye. En nativo el ancho de las columnas
se calcula con el `gap` resultante de esa misma clase, de modo que coincide
con la separacion visual. `Row` sigue usando el prop `gap` para su `pb-${gap}`
externo:

```tsx
import { Col, Grid } from '@/components/ui/grid';
import { Text } from '@/components/ui/text';

<Grid className="gap-4 px-2">
  <Col md={6}>
    <Text>Contenido</Text>
  </Col>
</Grid>;
```

Props de medicion (`rowGap`, `columnGap`, `flexDirection`, `padding`,
`paddingLeft`, `paddingRight`, `paddingStart`, `paddingEnd`, `borderWidth`,
`borderLeftWidth`, `borderRightWidth`): en nativo solo sirven como pistas
numericas para calcular el ancho de las columnas (`columnGap` sustituye al
gap del calculo, los paddings/bordes se descuentan del ancho medido y
`flexDirection` `column`/`column-reverse` deja los anchos en `auto`);
`rowGap` no se usa. No aplican espacio ni bordes visuales: usar clases.
En web se reenvian al `div` sin efecto.

En [nativo](../../z/grid/index.tsx) la malla mide su ancho con `onLayout`
y no renderiza las columnas hasta tenerlo. Un `onLayout` del consumidor se
reenvia despues y **reemplaza esa medicion**, de modo que las columnas nunca
se muestran; no pasar `onLayout` a `Grid` ni `Row`. En web `onLayout` se
descarta al traducir las props a atributos DOM.

Las clases de spans y gap se construyen en tiempo de ejecucion
(`gap-${gap}`, `md:col-span-${n}`, `xl:col-span-${n}`, `2xl:col-span-${n}`).
Tailwind solo genera las clases que aparecen literalmente en el codigo
fuente, y `global.css` no las incluye en su `@source inline`: es posible que
los spans `xl`/`xl2` o un `gap-N` arbitrario no tengan CSS generado.
Comprobar su disponibilidad al introducir valores nuevos.

En [web](../../z/grid/index.web.tsx) usa divs y CSS Grid;
en nativo usa una fila con `flex-wrap` y calcula el ancho de cada columna con
contexto, breakpoints de la ventana y el ancho medido. No inferir paridad
entre ambas implementaciones; comprobar la plataforma de destino.

Consumidor de composicion: [demo Grids](../../../pages/demo/Grids.tsx).
Las demos muestran estructura, no garantizan todos los estados de produccion.

## Divider

Fuentes: [ui/divider](../divider/index.tsx),
[z/divider](../../z/divider/index.tsx).

`orientation="horizontal"` por defecto (`h-px w-full`), o `"vertical"`
(`w-px h-full`). Base `bg-border`; acepta props de `View` y `className`, que
se combina con la base y puede cambiar color, grosor, ancho o margenes.

La plantilla define la linea horizontal con `w-auto`, que queda con ancho
cero dentro de un padre con `items-center` o en una fila; `ui/divider` le
agrega `w-full` para que ocupe el ancho disponible en columnas y filas.
En una fila con otros hijos, limitar el ancho con `className` (por ejemplo
`flex-1` o `w-8`); un `w-*` del consumidor prevalece.
La variante vertical necesita altura disponible en el padre o una clase
explicita, como `h-10`.

Solo en web expone `role="separator"`; en nativo no tiene rol accesible.
`aria-orientation` se pasa en ambas plataformas. No renderiza texto.

## StickyFooter

Fuente: [sticky-footer/index.tsx](../sticky-footer/index.tsx).

Acepta las props de `HStack`, combinando `className` con
`p-4 absolute bottom-0 left-0 right-0 bg-background-0 w-full`.
La separacion se controla con `space` (escala de `HStack`); por defecto es
`lg` (`gap-4`). Un `gap-*` en `className` prevalece sobre `space`.

El nombre no significa `position: sticky`: es **absoluto** y no reserva
espacio. El contenedor debe proporcionar contexto de posicionamiento y el
contenido debe dejar padding inferior para no quedar oculto. `FormLayout`
ya hace esa composicion; no anidar otro footer en el mismo formulario.
No gestiona insets de dispositivo ni teclado.

## Text y Heading

Fuentes: [Text](../../z/text/index.tsx),
[estilos Text](../../z/text/styles.tsx),
[Heading](../../z/heading/index.tsx).

| Prop compartida                                | Uso                                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| `children`                                     | Texto o composicion compatible con texto.                                    |
| `className`, `style`                           | Presentacion; usar tokens semanticos (`foreground`, `typography-*`, etc.).   |
| `size`                                         | Escala tipografica de la primitiva. Text usa `md`, Heading `lg` por defecto. |
| `bold`, `underline`, `strikeThrough`, `italic` | Variantes tipograficas booleanas.                                            |
| `isTruncated`                                  | Text: solo web (`web:truncate`). Heading: `truncate` en ambas plataformas.   |
| `sub`                                          | Reduce a texto xs; no implementa por si mismo semantica de subindice.        |
| `highlight`                                    | Usa fondo amarillo fijo, no un token contextual de seleccion.                |

`Text` admite tamanos `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`,
`4xl`, `5xl`, `6xl` y usa `text-foreground font-body` como base.
En nativo `isTruncated` no trunca: usar `numberOfLines`.
En nativo conserva props/ref de `RNText`; en
[web](../../z/text/index.web.tsx) representa un span y conserva sus
atributos/eventos DOM. No pasar `numberOfLines` al span esperando la
semantica nativa.

`Heading` utiliza encabezados de `@expo/html-elements` en nativo y
[h1-h6 DOM en web](../../z/heading/index.web.tsx).
La correspondencia de `size` es semantica ademas de visual:

| `size`              | Encabezado |
| ------------------- | ---------- |
| `3xl`, `4xl`, `5xl` | H1         |
| `2xl`               | H2         |
| `xl`                | H3         |
| `lg` (default)      | H4         |
| `md`                | H5         |
| `sm`, `xs`          | H6         |

`Heading` usa `text-foreground font-bold font-heading` como base.
`as={Componente}` permite elegir el elemento, conservando el estilo; en
nativo, con `as`, la `ref` **no se reenvia** al elemento (en web si).
Revisar jerarquia de encabezados: cambiar el tamano puede cambiar el nivel,
no solo el aspecto. El `Text` auxiliar en `form/Text` no es este export.

## Icon

Fuente de exports: [icon/index.tsx](../icon/index.tsx).
Reexporta `Icon`, `UIIcon`, `createIcon` e iconos nombrados de
[z/icon](../../z/icon/index.tsx), sin una capa adicional.

```tsx
import { Icon, SearchIcon } from '@/components/ui/icon';

<Icon
  as={SearchIcon}
  size="sm"
  className="text-typography-500"
/>;
```

Usar `as` con el componente del icono, no una cadena de nombre.
El barrel incluye familias como flechas, chevrons, `CheckIcon`, `CloseIcon`,
`EyeIcon`, `EyeOffIcon`, `SearchIcon`, `TrashIcon`, `SettingsIcon`,
`AlertCircleIcon`, `InfoIcon`, `MenuIcon` y `DownloadIcon`; consultar el
archivo para el nombre exacto. Los iconos de Lucide tambien se usan en el
repositorio, sin necesidad de crear wrappers por icono.

`Icon` usa size `md` por defecto. Su escala visual es `2xs` 12px,
`xs` 14px, `sm` 16px, `md` 18px, `lg` 20px y `xl` 24px.
La base incluye `text-foreground fill-none pointer-events-none`.
Las variantes [web](../../z/icon/index.web.tsx) y nativa difieren en
SVG e interop; usar clases completas para color y comprobar stroke/fill.

Un icono decorativo no sustituye el nombre accesible de una accion.
Para botones, usar `Button.Icon as={...}` o revisar el contrato de la
primitiva si se necesita una etiqueta accesible no expuesta por el wrapper.

## Image

Fuente: [ui/image](../image/index.tsx),
[z/image](../../z/image/index.tsx).

`Image` de `ui` consume **`src`**, no `source` como API de entrada:

- Un string se convierte en `source={{ uri: src }}`.
- Un recurso local u objeto se transmite como `source={src}`.
- El `source` generado va despues del spread; pasar solo `source` sin `src`
  no funciona como en `RNImage`.

Las props restantes llegan a la primitiva, incluido `alt`, `resizeMode`,
`size` y `className`. La escala `size` local es:
`2xs` 24, `xs` 40, `sm` 64, `md` 80, `lg` 96, `xl` 128,
`2xl` 256, `full` ancho/alto completos, `none` sin dimensiones de variante.

La base impone `max-w-full` y usa `md` por defecto. En web la primitiva
sobrescribe `style` con dimensiones `revert-layer`; en nativo lo sobrescribe
con `undefined`. No depender de un `style` de dimensiones personalizado sin
revisar esa limitacion. Para dimensiones por clases, `size="none"` evita
competir con una variante fija.

## Avatar

Fuente: [Avatar.tsx](../avatar/Avatar.tsx).

| Prop            | Uso                                                                 |
| --------------- | ------------------------------------------------------------------- |
| `src`           | String URI convertido a objeto `source`, o recurso/objeto directo.  |
| `text`          | Nombre del que se muestran hasta dos iniciales en mayusculas.       |
| `textClassName` | Clase del fallback.                                                 |
| `alt`           | Nombre accesible de la imagen creada desde `src`.                   |
| `badge`         | Construye la clase `bg-${badge}-500` del indicador.                 |
| `children`      | Composicion adicional despues de imagen, texto y badge automaticos. |
| `size`          | `xs`, `sm`, `md` (default), `lg`, `xl`, `2xl`; otro valor usa `md`. |
| `className`     | Clases de la raiz; se combinan con las dimensiones de `size`.       |
| Resto de props  | Se transmite a la raiz Avatar (props de `View`).                    |

Miembros: `Avatar.Image`, `Avatar.Text`, `Avatar.Badge`. El barrel tambien
exporta `AvatarImage`, `AvatarFallbackText` y `AvatarBadge` nombrados.
Los miembros de primitiva usan su propia API; `Avatar.Image` recibe `source`,
no el atajo `src` de la raiz.

- `text` solo produce iniciales cuando es un string: el fallback toma la
  primera letra de hasta dos palabras. Otro contenido (numero, JSX) no se
  muestra. Lo mismo aplica a los hijos de `Avatar.Text`.
- `size` de la raiz ajusta raiz, iniciales e indicador. En `Avatar.Text` y
  `Avatar.Badge` el prop `size` se acepta por compatibilidad pero se ignora:
  usar `className` (`text-3xl`, `h-6 w-6`).
- `Avatar.Image` se oculta si falla la carga y deja visibles las iniciales;
  la primitiva sobrescribe `onError`, por lo que el callback del consumidor
  no se invoca.

```tsx
import { Avatar } from '@/components/ui/avatar';

<Avatar
  size="sm"
  src={avatarUrl}
  text="Nombre visible"
/>;
```

No combinar accidentalmente `src`/`text` automaticos con hijos que dupliquen
imagen o fallback. Los colores dinamicos del badge deben existir en el tema
y en las clases generadas.

## Badge

Fuente: [Badge.tsx](../badge/Badge.tsx).

| Prop                 | Contrato                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| `variant`            | Declara `primary`, `secondary`, `success`, `danger`, `error`, `warning`, `info`, `light`, `dark`, `outline`. |
| `outline`            | Booleano que agrega `border` del color de la accion; conserva el fondo claro.                                |
| `pill`               | `rounded-full`; de lo contrario `rounded-sm`.                                                                |
| `size`               | `sm`, `md` (defecto) o `lg`; escala texto, padding e icono. Otro valor usa `md`.                             |
| `className`          | Clase del badge interior.                                                                                    |
| `containerClassName` | Clase del Box exterior, con `flex-row`.                                                                      |
| `children`           | Un string se envuelve en `BadgeText`; el resto se usa directamente.                                          |

Mapeo real de color: `success`, `warning`, `info` conservan su accion;
`danger` y `error` usan `error` (rojo); `primary`, `secondary`, `light`,
`dark` y `outline` caen en `muted`. Para borde usar el booleano `outline`,
no `variant="outline"`: el borde se suma al fondo claro de la accion, no lo
reemplaza.

La plantilla v5 no define variante de tamano, asi que `ui/badge` aplica la
escala:

| `size` | Badge         | `Badge.Text` | `Badge.Icon`  |
| ------ | ------------- | ------------ | ------------- |
| `sm`   | `px-1.5 py-0` | `text-2xs`   | `h-2.5 w-2.5` |
| `md`   | `px-2 py-0.5` | `text-xs`    | `h-3 w-3`     |
| `lg`   | `px-2.5 py-1` | `text-sm`    | `h-3.5 w-3.5` |

Miembros `Badge.Text` y `Badge.Icon`; ambos heredan el color de la accion y
el tamano del badge. `Badge.Text.size` y un `Badge.Icon.size` de la escala
(`sm`/`md`/`lg`) lo sustituyen; un `size` numerico del icono fija pixeles.
`className` del badge, del texto y del icono prevalece sobre la escala.
En `Badge.Text` las props `bold`, `italic`, `underline`,
`strikeThrough`, `highlight`, `isTruncated` y `sub` estan tipadas pero no
tienen efecto; usar `className`. Para un numero o contenido mixto,
componer texto explicitamente:

```tsx
import { Badge } from '@/components/ui/badge';

<Badge
  variant="warning"
  outline
  pill
>
  <Badge.Text>{cantidad}</Badge.Text>
</Badge>;
```

## Card

Fuente: [Card.tsx](../card/Card.tsx).

`Card` usa **`VStack` por defecto**, no una primitiva Card de
`components/z`; sus props base (`CardPrimitiveProps`) son las de `View`.
`as={Componente}` cambia el contenedor.
Reenvia props y ref; el aspecto de tarjeta debe expresarse con clases.
Las props declaradas `bg`, `border`, `text`, `body` no se convierten en
colores, borde o padding.

| Miembro       | Base / contrato                                                            |
| ------------- | -------------------------------------------------------------------------- |
| `Card.Body`   | `VStack`.                                                                  |
| `Card.Title`  | `Heading`.                                                                 |
| `Card.Image`  | Imagen con `src: string` transformado a URI.                               |
| `Card.Text`   | `HStack` por defecto; `as` permite otra base. **No** envuelve texto libre. |
| `Card.Footer` | `HStack`, tipado con `CardActionsProps`.                                   |

`Card.Text` es una fila (`HStack`), no un texto: en nativo el texto libre
como hijo falla, asi que envolverlo en `Text`
(`<Card.Text><Text>...</Text></Card.Text>`).

El barrel exporta `Card` y todos sus tipos de props. Los valores `CardBody`, `CardTitle`,
`CardImage`, `CardText` y `CardActions` se exportan desde el archivo de
implementacion, no desde la carpeta. Sus contratos reutilizan las props
congeladas de VStack, Heading, Image y HStack; las refs de los miembros con
forwardRef siguen al elemento correspondiente.

```tsx
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

<Card className="p-4 rounded-lg border border-outline-200 bg-background-0">
  <Card.Body>
    <Text className="font-semibold">Resumen</Text>
    <Text>Contenido de la tarjeta</Text>
  </Card.Body>
</Card>;
```

## Stats

Fuente: [Stats.tsx](../stats/Stats.tsx).

`data` es un arreglo de `{ label: string; value: string | number }`.
Representa cada valor y etiqueta en un `VStack`, todos dentro de un `HStack`,
con divisores verticales entre elementos.

No recibe callbacks, formato monetario, carga ni clases personalizadas.
Formatear valores en el consumidor y considerar ancho/texto largo: no
virtualiza, no agrega scroll y no cambia automaticamente a columnas en movil.
Sus textos usan `text-dark` y `font-roboto`, que no tienen token en
`global.css`: el color efectivo es el de `Text` (`text-foreground`) y la
fuente la de `font-body`. No copiar esas clases en componentes nuevos.
