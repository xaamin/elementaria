# Acciones y navegacion

[Indice general](../README.md) / [Estados y superposiciones](estados-y-superposiciones.md)

## Button

Fuente: [Button.tsx](../button/Button.tsx).
Importacion: `import { Button } from '@/components/ui/button'`.
El barrel exporta `Button` y los tipos `ButtonProps`, `ButtonTextProps`
y `ButtonIconProps`.

| Prop                      | Valor por defecto / efecto                                                                                                                                                       |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`                | Obligatorio, `ReactNode`. Texto, numeros o composicion.                                                                                                                          |
| `variant`                 | `primary`. Mapea color y presentacion; ver tabla siguiente.                                                                                                                      |
| `outline`                 | Presentacion con borde y fondo transparente conservando el color de la variante; se ignora con `link`.                                                                           |
| `size`                    | `xs`, `sm`, `md`, `lg`, `xl`; sin valor agrega `h-14`.                                                                                                                           |
| `disabled`                | Deshabilita y bloquea el handler local.                                                                                                                                          |
| `isDisabled`              | Se reenvia a la primitiva. No es el guard explicito del handler.                                                                                                                 |
| `indeterminate`           | Spinner antes de hijos y bloqueo de la accion.                                                                                                                                   |
| `block`                   | Agrega `w-full`.                                                                                                                                                                 |
| `rounded`                 | Boton circular para un solo icono como hijo: ancho igual a la altura en todos los tamanos, sin padding y sin encogerse. Tiene prioridad sobre `block`. Compatible con `outline`. |
| `icon`                    | Solo xs agrega `w-10 p-0`; no elige ni representa un icono automaticamente.                                                                                                      |
| `accessibilityLabel`      | Nombre accesible reenviado a la primitiva; usar en botones solo con icono.                                                                                                       |
| `className`               | Clases de la raiz; se combinan con `cn` despues de color y forma. La raiz siempre agrega antes `self-start`; altura, `w-full` y anchos de `rounded` se agregan despues.          |
| `autoFocus` / `isFocused` | Calcula `isFocused`; no implementa por si mismo foco DOM imperativo.                                                                                                             |
| `onPress`                 | Callback sin argumentos.                                                                                                                                                         |
| `onClick`                 | Callback adicional; el wrapper lo invoca sin pasar evento.                                                                                                                       |
| `href`, `type`, `ref`     | Se reenvian; no implementan navegacion de Expo Router por si solos.                                                                                                              |

### Variantes y tamanos reales

| `variant`   | Color     | Presentacion                                                                                         |
| ----------- | --------- | ---------------------------------------------------------------------------------------------------- |
| `primary`   | primary   | relleno solido (`primary-600`, borde del mismo color, texto `typography-0`)                          |
| `secondary` | secondary | tintado con la escala pizarra (`secondary-100`, borde `-300`, texto `-700`)                          |
| `success`   | success   | tintado (`-100`, borde `-300`, texto `-700`)                                                         |
| `danger`    | danger    | relleno solido rojo vivo `fixed-danger` (no se invierte, texto blanco) para acciones destructivas    |
| `warning`   | warning   | tintado (`-100`, borde `-300`, texto `-700`)                                                         |
| `info`      | info      | tintado (`-100`, borde `-300`, texto `-700`)                                                         |
| `dark`      | dark      | superficie fija `fixed-dark`, que no se invierte en modo oscuro                                      |
| `neutral`   | neutral   | tintado con las escalas neutras (`background-100`, borde `outline-300`, texto `typography-700`)      |
| `light`     | neutral   | superficie fija `fixed-light` y borde suave `fixed-light-border`; con `outline`, borde `outline-500` |
| `outline`   | neutral   | outline: borde y fondo transparente                                                                  |
| `ghost`     | neutral   | outline sin borde (`border-0`) y fondo transparente que se tinta al pasar el cursor                  |
| `link`      | neutral   | link: sin padding horizontal, subrayado al pasar el cursor/pulsar                                    |

El prop `outline` convierte cualquier variante, salvo `link`, a la
presentacion outline conservando su color: por ejemplo,
`variant="danger" outline` usa borde y texto de error. Con `ghost` se
mantiene `border-0`, por lo que no se ve borde.
Las clases de color se indexan directamente por la variante (`primary` a
`neutral`); las variantes de presentacion (`light`, `outline`, `ghost`,
`link`) usan las de `neutral`.

`variant` tiene el tipo `ButtonVariant`, la union literal de `primary`,
`secondary`, `success`, `danger`, `warning`, `info`, `dark`, `light`,
`neutral`, `link`, `ghost` y `outline`; TypeScript rechaza cualquier otro
string. No existen variantes `outline-*` ni `transparent` (combinada con
`ghost`): usa `variant="danger" outline` o `variant="ghost"`. En runtime, un
valor fuera de la union (por ejemplo, desde JavaScript) se ve neutro solid.
`Dropdown.Toggle` (`ComponentColor`, alias de `ButtonVariant`) y
`EmptyState.buttonVariant` usan el mismo tipo.

Las clases de altura son xs `h-10`, sm `h-12`, md `h-14`, lg `h-16`,
xl `h-[72px]`. Con `rounded`, los anchos respectivos son `w-10`, `w-12`,
`w-14`, `w-16` y `w-[72px]`; sin `size` usa `h-14 w-14`.
El wrapper consume `size` y no lo transmite a `TheButton`;
la tipografia de los hijos no se ajusta necesariamente con esas alturas.

### Hijos y ejecucion

Si todos los hijos son strings/numeros los agrupa en un `ButtonText`.
En contenido mixto, envuelve cada string/numero, conservando elementos React.
`Button.Text` y `Button.Icon` envuelven las primitivas y heredan por contexto
el color de texto e icono de la variante y la presentacion.

```tsx
import { Button } from '@/components/ui/button';
import { AddIcon } from '@/components/ui/icon';

<Button
  onPress={onCreate}
  indeterminate={busy}
>
  <Button.Icon as={AddIcon} />
  <Button.Text>Crear registro</Button.Text>
</Button>;
```

`onCreate` y `busy` pertenecen al consumidor. Elegir **un solo callback**:
si se proporcionan `onPress` y `onClick`, se ejecutan ambos, en ese orden.
El handler local retorna temprano con `disabled || indeterminate`.
La combinacion final de `isDisabled` incluye `props.isDisabled`, pero
`...rest` puede sobrescribir ese calculo si el consumidor pasa
`isDisabled` explicitamente. Evitar estados de bloqueo contradictorios.

El boton no espera una promesa, no captura errores y no hace debounce.
El consumidor debe controlar doble envio y presentar fallos. Para acciones
solo con icono, usar `accessibilityLabel` como nombre accesible.
La interfaz local no declara las demas props de accesibilidad heredadas.

## ButtonGroup

Fuente: [ButtonGroup.tsx](../button-group/ButtonGroup.tsx).

Agrupa elementos React en un `HStack` y clona sus clases para quitar radios
interiores y bordes izquierdos. Los hijos que no son elementos validos se
descartan; usar varios `Button` como hijos directos.

```tsx
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

<ButtonGroup>
  <Button
    variant="light"
    onPress={onPrevious}
  >
    Anterior
  </Button>
  <Button
    variant="light"
    onPress={onNext}
  >
    Siguiente
  </Button>
</ButtonGroup>;
```

Solo recibe `children`: no acepta variantes, tamanos, callbacks ni ref.
Las demas props, como `aria-label`, `role` o `className`, se descartan y no
llegan al `HStack`; nombrar el grupo desde su contenedor si hace falta.
Configurar cada boton directamente. Los extremos se calculan sobre los hijos
validos, de modo que los botones condicionales ocultos no alteran los radios;
solo el primero y el ultimo conservan las esquinas exteriores redondeadas y
los siguientes omiten su borde izquierdo para no duplicar la separacion.

## Pressable

Fuente: [ui/pressable](../pressable/index.tsx) ->
[z/pressable](../../z/pressable/index.tsx).

Reexport de la primitiva Gluestack. Usar para una superficie interactiva que
no tenga semantica de boton estandar, conservando sus props de React Native,
accesibilidad y clases. No agrega spinner, texto, confirmacion ni enlace
al validador. Envolver texto en `Text`.

No usarlo para recrear el aspecto y los estados de `Button` en cada modulo.
Si se necesita navegacion interna, conservar Expo Router y el layout de la
aplicacion; no deducir navegacion de una clase `cursor-pointer`.

## Link y ExternalLink

Fuentes: [Link.tsx](../link/Link.tsx),
[ExternalLink.tsx](../link/ExternalLink.tsx).
Ambos se exportan desde `@/components/ui/link`.

| Componente     | Contrato                                                                  |
| -------------- | ------------------------------------------------------------------------- |
| `Link`         | `href` o alias `to`, `children`, `className`, `target`, `rel`.            |
| `Link.Text`    | Primitiva `LinkText` con color `text-info-700` para composicion de texto. |
| `ExternalLink` | Props del Link de Expo Router, con `href: string` obligatorio.            |

**Limitacion de `Link`:** solo reenvia `href ?? to` cuando `children` es
un string; entonces agrega `LinkText`. Con elementos/fragmentos como hijos
se pierden ambas props de destino en el retorno. No asumir que
`<Link href="..."><Link.Text>...</Link.Text></Link>` mantiene la URL.

`Link` tampoco es un wrapper del router: usa la primitiva Gluestack. En web
genera un `<a href>` y el navegador hace una carga completa del documento,
sin conservar el estado de la app. En nativo pulsarlo llama a
`Linking.openURL(href)`, que no resuelve rutas relativas de la app, por lo
que `href="/ruta"` no navega. Para navegar dentro de la app usar Expo Router.
`target` y `rel` se reenvian a la primitiva, pero react-native-web solo
traslada al `<a>` los atributos de `hrefAttrs`: `target="_blank"` no abre una
pestana nueva. Para destinos externos usar `ExternalLink`.

`ExternalLink` usa Expo Router con `target="_blank"`. En nativo cancela el
comportamiento por defecto y llama a `WebBrowser.openBrowserAsync(href)`.
Su `onPress` interno sustituye al proporcionado; no se ejecuta un callback
adicional del consumidor. En web conserva el comportamiento del enlace.
Revisar destinos externos y atributos segun la plataforma.

## Dropdown

Fuente: [Dropdown.tsx](../dropdown/Dropdown.tsx).
Se monta siempre cerrado y se abre tras el primer render, aunque reciba
`show` desde el inicio: con `@gluestack-ui/core` 5 y las plantillas desde v4, un
overlay renderizado abierto en su montaje no se desmonta al cerrarse.
El barrel exporta solo `Dropdown`; la implementacion exporta tambien
`DropdownToggle`, `DropdownMenu`, `DropdownItem`, `DropdownDivider`.
La API usual es compuesta:

```tsx
import { Dropdown } from '@/components/ui/dropdown';

<Dropdown placement="bottom right">
  <Dropdown.Toggle variant="light">Acciones</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item
      size="sm"
      onPress={onEdit}
    >
      Editar
    </Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Item
      size="sm"
      onPress={onDelete}
    >
      Eliminar
    </Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>;
```

Estructura esperada: primer hijo trigger, segundo hijo `Dropdown.Menu`.
El menu toma los hijos de ese segundo elemento. No admite una estructura
arbitraria de nodos, strings, hijos ausentes o fragmentos equivalentes.
Tambien reconoce `Dropdown.Toggle` dentro de los hijos directos del primer
elemento, como un grupo de botones.

`Dropdown.Item closeOnSelect={false}` mantiene el menu abierto tras pulsarlo.
`show` con `onOpen`/`onClose` lo controla desde fuera, por ejemplo para
ocultarlo mientras un dialogo propio esta abierto.

Capas en web: React Aria montaria el menu en `document.body` con `zIndex`
100000, por encima de los dialogos de Gluestack (9999 dentro de la raiz de
la app). `MenuLayer.web.tsx` lo monta, mientras esta abierto, en el proveedor
de overlays con el `zIndex` de `menuLayerContext.ts`: 9000 en la pagina, por
debajo de los dialogos, y 10000 dentro de `AlertDialog`, `Modal` y `Drawer`,
que lo indican con `MenuLayerContext`, por encima de su dialogo.
El menu se abre hasta que esa capa existe, porque React Aria solo calcula
su posicion respecto al trigger al pasar de cerrado a abierto. Un dialogo
nuevo debe proveer ese contexto si puede contener menus.

| Prop de raiz                         | Contrato / limitacion                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `placement`                          | Por defecto `'bottom right'`. Admite bottom/top/right/left y combinaciones con alineacion. Preferirlo para posicionar.   |
| `show`                               | Se sincroniza a estado `visible`, que abre la capa del menu y con ella `isOpen` del Menu.                                |
| `onOpen`, `onClose`                  | Se invocan al abrir y cerrar el menu; combinarlos con `show` para mantenerlo controlado.                                 |
| `className`                          | Llega al contenedor del menu (la lista desplegada), no al trigger. El spread final la aplica tal cual y reemplaza `p-0`. |
| `onSelect`, `onToggle` y otras props | Se reenvian al Menu sin adaptacion; usar `onPress` en cada item y `onOpen`/`onClose` en la raiz.                         |
| `focusFirstItemOnShow`               | Foco inicial en web; ver abajo. En nativo no se aplica.                                                                  |

`focusFirstItemOnShow` ajusta solo el foco inicial al abrir el menu en web
(`MenuLayer.web.tsx`); despues React Aria gestiona la navegacion:

| Valor                  | Clic                    | Teclado                                                                       |
| ---------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| `'keyboard'` (defecto) | Foco en la lista.       | Foco en el primer item habilitado.                                            |
| `true`                 | Primer item habilitado. | Primer item habilitado.                                                       |
| `false`                | Foco en la lista.       | Foco en la lista; la primera flecha va al primer o al ultimo item habilitado. |

El trigger `Dropdown.Toggle` se transforma en `Button` con las props que
proporciona Gluestack para abrir el menu. Su valor por defecto es size sm;
la variante es light cuando es el trigger directo y la de `Button`
(`primary`) cuando esta dentro de otro elemento. Sus props se aplican
despues de las de apertura: un `onPress` propio sustituye el handler y el
toggle ya no abre el menu.

### Items y separadores

Fuente de tipos: [DropdownItem](../dropdown/DropdownItem.tsx).

- `size="sm" | "md" | "lg" | "xl"` cambia padding vertical a
  `py-2` / `py-4` / `py-6` / `py-8`; la base usa `px-4 gap-4`.
- Strings dentro del item se envuelven en `MenuItemLabel`; elementos como
  iconos se conservan. Se infiere `textValue` de texto simple para el menu.
- `onPress` es el callback usado habitualmente por los consumidores.
  `href` agrega `anchor: true`; no lo confundir con una ruta de Expo Router
  conectada automaticamente.
- `disabled` atenua el item e impide elegirlo; se anuncia con
  `aria-disabled` y lo cubren las pruebas nativa y web.
- `active`, `eventKey`, `onClick` y `onSelect` se reenvian sin adaptacion:
  verificar el contrato de [z/menu](../../z/menu/index.tsx), no asumir
  equivalencia Bootstrap; usar `onPress` para la accion del item.
- `Dropdown.Divider` es `MenuSeparator`.

`Dropdown.Menu` y `Dropdown.Toggle` son marcadores que por si solos solo
devuelven sus hijos. El menu no reenvia sus `className`, `align`,
`alignRight`, `show` o configuracion Popper a un contenedor independiente.
Para ancho, usar `className` de la raiz (que reemplaza `p-0`) o de los
items; no confiar en `Dropdown.Menu className="w-52"`.

Referencias: [ejemplos de Dropdown](../../../pages/docs/dropdown/examples),
[listado de clientes](../../../apps/finanzas/clientes/ListClientesPage.tsx).

## Tabs

Fuente: [tabs/index.tsx](../tabs/index.tsx).

```tsx
import { Tabs } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';

<Tabs
  activeTab="general"
  tabs={[
    { tabKey: 'general', label: 'General', content: <Text>General</Text> },
    { tabKey: 'detalle', label: 'Detalle', content: <Text>Detalle</Text> },
  ]}
/>;
```

`tabs` por defecto es `[]`. Cada entrada tiene `tabKey: string`, `label`,
`content`, y opcionalmente `leftIcon`/`rightIcon`.
Las claves deben ser unicas.

`activeTab` inicializa estado interno y actualizaciones truthy del prop
lo resincronizan. Pulsar una tab cambia ese estado, pero no existe callback
`onChange`. Sin `activeTab` no elige automaticamente la primera y no muestra
contenido; si la clave deja de existir tampoco hay fallback.

Solo representa el contenido activo; el anterior se desmonta, por lo que
un formulario dentro puede perder estado local. No usarlo como router ni
esperar que preserve todas las pantallas.
Las cabeceras tienen rol `tab` con estado `selected` dentro de un `tablist`.
Los colores usan tokens del tema y siguen el modo claro/oscuro: fondo
`background-0`; la tab activa usa fondo `primary-50`, indicador `primary-500`
y texto `primary-700`; texto inactivo
`typography-600` y borde inferior `outline-100`. No implementa flechas de
teclado ni scroll de cabecera; comprobar muchas tabs antes de reutilizarlo.

## Stepper

Fuente: [Stepper.tsx](../stepper/Stepper.tsx).
Importar `Stepper` y los tipos `Step`, `StepperProps`, `StepperOrientation`,
`StepperLabelPlacement` y `StepperMobileIndicator` desde
`@/components/ui/stepper`.

| Prop                                          | Contrato                                                                                 |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `steps`                                       | `Step[]` obligatorio: `id` unico, `title`, `description?`, `content?`, `disabled?`.      |
| `activeStep`                                  | Indice base cero controlado; actualizarlo desde `onStepChange`.                          |
| `defaultActiveStep`                           | Indice inicial no controlado, por defecto `0`.                                           |
| `onStepChange`                                | Recibe el indice al navegar; no se notifica al montar.                                   |
| `onBeforeNext`                                | `(step: number) => boolean \| Promise<boolean>`. `false` impide avanzar o completar.     |
| `onComplete`                                  | Callback final, admite promesa. No reinicia ni desmonta el Stepper.                      |
| `orientation`                                 | `'horizontal'` por defecto o `'vertical'`.                                               |
| `allowStepSelect`                             | `true` por defecto; permite seleccionar cualquier paso habilitado, anterior o posterior. |
| `showControls`                                | `true` por defecto; muestra Anterior y Siguiente/Completar.                              |
| `nextLabel`, `previousLabel`, `completeLabel` | Etiquetas; defaults `Next`, `Previous`, `Complete`.                                      |
| `hideDescriptions`                            | `false` por defecto; oculta las descripciones del encabezado.                            |
| `labelPlacement`                              | `'bottom'` por defecto: titulo bajo cada circulo. `'active-bottom'`: solo el activo.     |
| `mobileIndicator`                             | `'circles'` por defecto o `'progress'`; indicador del modo compacto.                     |
| `className`                                   | Clases del contenedor.                                                                   |

En horizontal, si el ancho de la ventana (`useWindowDimensions`, no el del
contenedor) es menor de 640px, el Stepper usa un modo compacto: muestra
`Paso n de total`, el indicador elegido con `mobileIndicator` (circulos
pequenos o una barra con porcentaje) y el titulo y la descripcion del paso
activo. En ese modo se ignora `labelPlacement`; en vertical no hay modo
compacto. Con `labelPlacement="active-bottom"` los circulos van en una fila
con conectores que se colorean al completar pasos, y debajo solo se muestra
el titulo del paso activo.

El ejemplo [StepperRequest.tsx](../../../pages/docs/stepper/examples/StepperRequest.tsx),
disponible en `/docs/stepper`, combina un registro controlado con validacion
real por paso mediante `useValidator` y una peticion antes de avanzar. Su
codigo se muestra desde ese mismo archivo, con imports, estado y callbacks.

Tras validar el paso, `onBeforeNext` consulta `https://jsonplaceholder.typicode.com/posts/n`
para el paso n (`/posts/1`, `/posts/2` y `/posts/3`). El Stepper espera la
respuesta y bloquea la navegacion, pero no muestra ningun indicador de carga:
el spinner, el texto `Consultando JSONPlaceholder /posts/n...` y la barra de
solicitudes completadas pertenecen al ejemplo
([useStepRequest](../../../pages/docs/stepper/hooks/useStepRequest.ts)). Una espera minima de 800ms hace
visible la carga incluso con respuestas rapidas.
Los errores HTTP, de red, de formato o de timeout impiden avanzar y permiten
reintentar desde el mismo paso. La solicitud se cancela al desmontar el ejemplo.

Son GET publicos sin datos del formulario, cookies ni referrer. El ejemplo usa
`fetch` anonimo para no pasar por credenciales ni interceptores de autenticacion
del cliente HTTP de negocio. Los encabezados se deshabilitan
(`allowStepSelect={false}`) para que cada avance pase por la validacion y la
consulta.

Solo se monta el `content` del paso activo, identificado por `step.id` para no
reutilizar el estado interno de otro paso. Mantener los valores fuera de ese
contenido si deben sobrevivir al cambio de paso. En modo controlado, el
consumidor debe mantener `activeStep` dentro de los limites del arreglo:
fuera de ellos el Stepper retorna `null`.

El circulo activo tiene borde primario y fondo transparente. Los pasos
completados conservan el relleno primario y el check; los futuros usan borde neutro.

Los controles son `Button` de tamano `xs`: Anterior y Siguiente usan la
variante `outline` y Completar, en el ultimo paso, la variante `primary`.
`Button` decide el color de la etiqueta segun la variante, por lo que contrasta
con su fondo en ambos modos. Para otra presentacion, usar
`showControls={false}` con botones propios.

Siguiente y Anterior omiten pasos deshabilitados. `onBeforeNext` tambien se
ejecuta antes de `onComplete`, pero no al retroceder o pulsar un encabezado.
Durante los callbacks asincronos se bloquean tanto los botones de navegacion
como los encabezados para evitar que una respuesta pendiente sobrescriba el
paso seleccionado; no se muestra texto ni indicador de carga, por lo que el
consumidor debe presentarlo si lo necesita. Usar `allowStepSelect={false}` para un flujo lineal que
siempre avance mediante Siguiente y su validacion. Los rechazos no se
capturan: presentar los errores en los callbacks del consumidor. No atribuir
guardado, validacion ni manejo de errores remoto al Stepper.

## Accordion

Fuente: [Accordion.tsx](../accordion/Accordion.tsx).

Componente compuesto con `Accordion.Item`, `.Header`, `.Trigger`, `.Title`,
`.Content`, `.Divider`. Los miembros son primitivas; cada item usa su
`value` para identificarse.

```tsx
import { Accordion } from '@/components/ui/accordion';
import { Text } from '@/components/ui/text';

<Accordion>
  <Accordion.Item value="general">
    <Accordion.Header>
      <Accordion.Trigger>
        <Accordion.Title>Informacion general</Accordion.Title>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      <Text>Contenido desplegable</Text>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>;
```

Defaults de raiz: `size="md"`, `variant="filled"`, `type="single"`,
`isCollapsible=true`, `isDisabled=false`,
`className="m-5 w-[90%] shadow-none"`.
El runtime reenvia el resto despues de esos defaults. `AccordionProps`
es un contrato congelado y permite configurar apertura simple/multiple,
valor y callbacks segun esa API. Los tipos de Item, Header, Trigger, Title,
Content y Divider tambien se exportan desde `@/components/ui/accordion`.

`Accordion.Content` no se desmonta al colapsar: conserva su estado. La
plantilla anima la altura y la opacidad hasta 0 y, en web, el core marca el
contenido colapsado con `aria-hidden` e `inert`. En pruebas, expandir el item
con su trigger antes de interactuar con su contenido.

`size` de la raiz no se ignora: se comparte por contexto y fija el tamano de
`Accordion.Title` (sm `text-sm`, md `text-base`, lg `text-lg`, siempre en
negrita); el `size` del propio titulo no tiene efecto. `variant` (`filled` por
defecto, o `unfilled`) se comparte igual y conserva el fondo de v3: con
`filled` la raiz agrega `bg-white shadow-hard-2` y los items
`bg-background-0`; con `unfilled` los items son transparentes. El `variant`
de cada item se ignora. Un `className` propio reemplaza el default completo
(`m-5 w-[90%] shadow-none`), no se combina con el; `bg-white` de `filled` es
un color fijo, no un token del tema.
`Accordion.Trigger` envuelve un string en `Accordion.Title`.

## PanelOptions

Fuente: [PanelOptions.tsx](../panel-options/PanelOptions.tsx).

Recibe `options` y `title`. Cada opcion usa `iconName` como componente de
icono, `subText` como texto y `endIcon` como icono final. Muestra un titulo
Heading opcional y una columna con borde/divisores.

No usa `Pressable` ni consume `onPress`, rutas o permisos de las opciones.
Es una presentacion estatica, **no un menu de navegacion**.
No crear destinos de aplicacion solo porque este componente dibuje una fila
con flecha.

## PreviewControls

Fuente: [preview-controls/index.tsx](../preview-controls/index.tsx).

| Prop            | Contrato                                            |
| --------------- | --------------------------------------------------- |
| `count`         | Numero de elementos, obligatorio.                   |
| `title`         | String opcional, truncado.                          |
| `showCounter`   | `true` por defecto; contador solo cuando count > 1. |
| `onIndexChange` | `(index: number) => void`, indice base cero.        |

Mantiene `index=0` local y notifica al montar y al cambiar indice.
Los botones "Anterior" y "Siguiente" se bloquean en limites; el contador
muestra base uno.
Con `count === 1` y sin titulo retorna `null` (el efecto aun notifica).

No recibe un indice controlado, no carga ni representa el elemento.
Cambiar `count` no reinicia ni ajusta el indice; si la coleccion se reduce
o se reemplaza, el consumidor debe gestionar esa identidad/remontaje.
Con count cero no debe usarse la notificacion inicial como acceso seguro
a un elemento existente.
