# Estados y superposiciones

[Indice general](../README.md)

## Elegir el mensaje y controlar su estado

| Necesidad                           | Componente                                                  |
| ----------------------------------- | ----------------------------------------------------------- |
| Operacion en curso en toda la vista | `Loading` (fixed por defecto).                              |
| Indicador dentro del flujo          | `Loading mode="relative"` o `Spinner`.                      |
| Listado sin registros               | `EmptyState`.                                               |
| Mensaje persistente en contenido    | `Alert`.                                                    |
| Error HTTP de guardado              | `FormLayout.error` / `ResponseError`, no un error de campo. |
| Notificacion transitoria            | `useToast` + `Toast`.                                       |
| Ayuda breve anclada a un elemento   | `Tooltip`.                                                  |
| Confirmacion binaria                | `Confirm`.                                                  |
| Dialogo con contenido personalizado | `AlertDialog` o `Modal`, segun el flujo.                    |
| Panel lateral                       | `Drawer`.                                                   |
| Render fuera del contenedor actual  | `Portal`.                                                   |

Estos componentes no ejecutan solicitudes ni conocen permisos. El consumidor
debe abrir/cerrar, mantener `busy`, presentar fallos y sincronizar el resultado.
`UIThemeProvider` ya monta `OverlayProvider` y `ToastProvider` (en nativo a
traves del `GluestackUIProvider` de `components/z`, en web directamente); no
montar proveedores nuevos por cada uso.

## Loading y Spinner

Fuentes: [Loading](../loading/index.tsx),
[ui/spinner](../spinner/index.tsx) ->
[z/spinner](../../z/spinner/index.tsx).

`Loading` solo recibe `mode?: 'fixed' | 'relative'`.

- `fixed` por defecto: Portal abierto con contenedor absoluto que ocupa
  ancho/alto, zIndex 999 y spinner grande. El nombre no significa una
  garantia de `position: fixed` DOM.
- `relative`: `HStack` con spinner grande y padding, dentro del flujo.

Controlar su montaje: `{busy && <Loading />}`. No hay `isLoading`, mensaje,
timeout ni callback de finalizacion. La capa no agrega un backdrop de
bloqueo: no usarla como unica defensa frente al doble envio.

`Spinner` es un `ActivityIndicator` adaptado a clases, tipado con
`SpinnerProps` (las props de esa base, como `size="small" | "large"` y `color`). Por defecto usa
`focusable=false` y `aria-label="loading"`; personalizar el nombre accesible
cuando corresponda. No confundir sus sizes con `sm`/`md` de otros controles.

## EmptyState

Fuente: [EmptyState.tsx](../empty-state/EmptyState.tsx).

| Prop             | Contrato                                                            |
| ---------------- | ------------------------------------------------------------------- |
| `description`    | Obligatoria, string o string[]; cada linea es un `Text`.            |
| `title`          | String opcional.                                                    |
| `image`          | String opcional; por defecto usa el recurso local `list-empty.png`. |
| `alt`            | Texto alternativo opcional; si falta usa `title`.                   |
| `imageClassName` | Se combina con aspecto cuadrado, ancho completo y maximo 250px.     |
| `buttonText`     | Si es truthy muestra la accion.                                     |
| `buttonAction`   | Callback de la accion.                                              |
| `buttonVariant`  | Por defecto `light`; usa la semantica real de `Button`.             |

```tsx
import { EmptyState } from '@/components/ui/empty-state';

<EmptyState
  title="Sin registros"
  description={['Todavia no hay elementos.', 'Crea el primero para comenzar.']}
  buttonText="Crear"
  buttonAction={onCreate}
/>;
```

`onCreate` es la accion de alta del consumidor. Pasar `image` (URI string)
solo para reemplazar la ilustracion por defecto. No representa estado de
error ni carga; mostrarlo solo despues de una respuesta vacia confirmada.

## Alert

Fuente: [Alert.tsx](../alert/Alert.tsx).

| Prop                     | Comportamiento                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`               | String envuelto en `AlertText`; JSX se conserva en un `VStack`. Sin hijos JSX la alerta es un solo elemento accesible con rol `alert` en nativo; con JSX conserva sus hijos accesibles por separado.                                                                                                                                                                                                              |
| `title`                  | Opcional; se renderiza como `Alert.Heading` antes de los hijos.                                                                                                                                                                                                                                                                                                                                                   |
| `description`            | Dentro de `Alert.Description`, despues de los hijos. String envuelto en `AlertText` con el color de la variante; JSX se conserva.                                                                                                                                                                                                                                                                                 |
| `show`                   | Solo `false` oculta; no mantiene estado interno de cierre.                                                                                                                                                                                                                                                                                                                                                        |
| `variant`                | `secondary`, `success`, `warning` e `info` usan su escala con los colores de Badge (fondo `-100`, texto `-700`) y borde `-300`; `primary` usa el relleno `primary-500` con borde del mismo color y texto y título `typography-0`; `danger` usa `error`; `neutral` (por defecto) usa las escalas neutras. El tipo solo admite esas 9 variantes (`light` y `dark` incluidas); otro valor en runtime usa `neutral`.  |
| `light`, `dark`          | Superficies fijas `fixed-light`/`fixed-dark`, que no se invierten en modo oscuro; `dark` tambien colorea el titulo. Con `outline` usan texto `typography-700`/`typography-900`.                                                                                                                                                                                                                                   |
| `className`              | Se combina con clases calculadas y `mb-3` mediante `twMerge`.                                                                                                                                                                                                                                                                                                                                                     |
| `outline`                | Reemplaza el fondo de color por `bg-background-0` y conserva el color de la variante en el borde (paso `-300`) y en el texto (paso `-600`, como en el outline de Button, porque los pasos oscuros son casi negros sobre la superficie). `neutral` usa borde `outline-300` y texto `typography-800`; `light`, borde `outline-200`, y `dark`, borde `background-800`. Sin ella el borde también usa el paso `-300`. |
| `dismissible`, `onClose` | Con `dismissible` agrega un boton de cierre con icono (`Cerrar alerta`) que llama `onClose(event)`. No oculta la alerta: el consumidor pone `show` en `false`.                                                                                                                                                                                                                                                    |

Miembros: `Alert.Heading`, basado en `Heading` (`size="md"`) con `mb-2`, que
solo usa `children` y `className` e ignora cualquier otra prop; y
`Alert.Description`, un `VStack` con `mb-2` que reenvia sus props.
Tipos exportados: `AlertProps`, `AlertHeadingProps`, `AlertDescriptionProps`.
Para mensaje simple:

```tsx
import { Alert } from '@/components/ui/alert';

<Alert variant="warning">Revisa los datos antes de continuar.</Alert>;
```

Para contenido mixto, usar componentes de texto explicitamente.
Para descartarlo, usar `dismissible` y ocultar la alerta desde `onClose`
controlando `show`; la alerta no guarda estado de cierre propio. Con
`dismissible`, en nativo la alerta conserva sus hijos accesibles por separado
para que el boton de cierre sea alcanzable.

```tsx
import { useState } from 'react';

import { Alert } from '@/components/ui/alert';

const [visible, setVisible] = useState(true);

<Alert
  variant="warning"
  dismissible
  show={visible}
  onClose={() => setVisible(false)}
>
  Tu sesion expira en 5 minutos.
</Alert>;
```

## Toast y useToast

Fuente: [ui/toast](../toast/index.tsx),
[z/toast](../../z/toast/index.tsx).

Exports: `Toast`, `ToastDescription`, `ToastTitle`, `useToast`.
Tambien existen `Toast.Description` y `Toast.Title`.

Como en Button, Badge y Alert, la raiz indica el color con `variant`
(`success`, `danger`, `warning`, `info`; el resto equivale a `muted`) y la
forma con `outline` (sin ella, `solid`). No admite `action`. Por defecto es
un toast claro (`muted`/`solid` con el estilo de la plantilla v5); los demas
colores usan la paleta v3. `Toast.Title` y `.Description` heredan el color.
De las props de texto declaradas en `Toast.Title` y `.Description`, solo
`size` (por defecto `md`) tiene efecto; `bold`, `underline`, `isTruncated` y
`strikeThrough` se ignoran: usar `className`.

```tsx
import { Button } from '@/components/ui/button';
import { Toast, useToast } from '@/components/ui/toast';

function SuccessNotice() {
  const { show } = useToast();

  const notify = () => {
    show({
      placement: 'top',
      render: ({ id }) => (
        <Toast
          nativeID={`toast-${id}`}
          variant="success"
        >
          <Toast.Title>Operacion completada</Toast.Title>
          <Toast.Description>Los cambios se guardaron.</Toast.Description>
        </Toast>
      ),
    });
  };

  return <Button onPress={notify}>Mostrar aviso</Button>;
}
```

El hook proviene de `createToastHook` de Gluestack; opciones de duracion,
identidad, cierre y consulta de actividad pertenecen a esa API instalada,
no a una implementacion adicional de `ui`. Desestructurar los miembros usados.
El provider existente debe envolver al consumidor.

`Toast.Title` anuncia su contenido a accesibilidad; preferir texto legible.
No sustituir con un toast efimero el detalle persistente de un fallo HTTP
que el usuario necesita corregir. Notificar exito solo tras confirmacion de
la operacion, no al pulsar el boton.

Referencias reales:
[NewSalePage](../../../apps/makinpos/sales/NewSalePage.tsx),
[ExpenseApprovalContainer](../../../apps/gastify/expenses/containers/ExpenseApprovalContainer.tsx).
Conservar los contratos actuales aunque consumidores antiguos no sigan todas
las convenciones de hooks.

## Tooltip

Fuente: [ui/tooltip](../tooltip/index.tsx).

Envuelve la raiz de [z/tooltip](../../z/tooltip/index.tsx) y agrega
`Tooltip.Content` y `Tooltip.Text`. Solo `Tooltip` sale del barrel.
El content envuelve un string en `TooltipText`; elementos React se preservan.
La raiz no es un reexport directo: informa `onOpen` y `onClose` una sola vez
por transicion, porque `@gluestack-ui/core` 5 programa un cierre al pulsar y
otro al soltar el disparador y notifica cada cambio aunque el estado no varie.
En web se abre con hover y foco; en nativo se abre con pulsacion larga y se
cierra al soltar.

```tsx
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Tooltip } from '@/components/ui/tooltip';

<Tooltip
  placement="top"
  trigger={(triggerProps) => (
    <Pressable
      {...triggerProps}
      accessibilityLabel="Informacion del campo"
    >
      <Text>Ayuda</Text>
    </Pressable>
  )}
>
  <Tooltip.Content>Descripcion breve del campo.</Tooltip.Content>
</Tooltip>;
```

La raiz y el content conservan las props de la primitiva, incluido el
trigger. Con `hasArrow`, `Tooltip.Content` dibuja una flecha decorativa
(oculta a lectores de pantalla) en el borde que mira al trigger, segun
`placement`: centrada, o cerca de la esquina con alineaciones como
`top left`. `arrowSize` (12 por defecto) es el ancho de su base y sobresale
la mitad; conviene que `offset` (10 por defecto) sea al menos esa mitad. Usa
el color del content (`background/90`): si cambias su fondo con `className`,
la flecha no lo sigue. Limite: la primitiva no expone la posicion final, asi
que si `shouldFlip` invierte el lado por falta de espacio la flecha sigue el
`placement` pedido; usar `shouldFlip={false}` cuando importe. En `Tooltip.Text` solo `size` tiene efecto; `bold`, `underline`,
`italic`, `isTruncated`, etc. se ignoran: usar `className`. Reenviar sus props al elemento interactivo; no reemplazar sus
eventos accidentalmente. La capa usa animacion y colores semanticos.
No dejar informacion indispensable solo en hover: comprobar teclado,
foco y tacto. Un tooltip no es un dialogo de formulario.

## Confirm

Fuente: [Confirm.tsx](../confirm/Confirm.tsx).

| Prop                    | Contrato                                                           |
| ----------------------- | ------------------------------------------------------------------ |
| `isOpen`                | Booleano opcional que controla apertura.                           |
| `title`                 | `ReactNode` obligatorio, dentro de un `Heading` `md`.              |
| `description`           | `ReactNode` opcional, dentro de un `Text` `sm`; solo si es truthy. |
| `children`              | Contenido adicional bajo la descripcion, en un `ScrollView`.       |
| `cancelText`            | `'Cancelar'`.                                                      |
| `confirmText`           | `'Confirmar'`.                                                     |
| `onConfirm`, `onCancel` | Callbacks obligatorios, sin argumentos.                            |

```tsx
import { Confirm } from '@/components/ui/confirm';

<Confirm
  isOpen={confirmOpen}
  title="Eliminar registro"
  description="Esta accion no se puede deshacer."
  confirmText="Eliminar"
  onConfirm={onConfirmDelete}
  onCancel={onCloseConfirm}
/>;
```

Usa `AlertDialog size="md"`; la solicitud de cierre del dialogo (backdrop,
Escape, atras en Android) llama a `onCancel` sin cerrarlo por si sola.
`onConfirm` no cierra automaticamente ni espera una promesa. No tiene prop
`busy`/`disabled` para sus botones. El consumidor debe impedir operaciones
repetidas y controlar cuando cierra; si el flujo requiere carga/error dentro
del dialogo, revisar composicion con `AlertDialog` en lugar de atribuir esas
capacidades a `Confirm`.

Su boton cancelar pasa `variant="outline"`, que `Button` renderiza como boton
secundario con borde.

## AlertDialog

Fuente: [AlertDialog.tsx](../alert-dialog/AlertDialog.tsx).
Se monta siempre cerrado y se abre tras el primer render, aunque reciba
`isOpen` desde el inicio: con `@gluestack-ui/core` 5 y las plantillas desde v4, un
overlay renderizado abierto en su montaje no se desmonta al cerrarse.
Desde la carpeta se exporta la version compuesta `AlertDialog`.
Solo solicita el cierre: llama a `onClose` y el consumidor debe poner `isOpen`
en `false`. En web su contenido termina con rol `dialog` (no `alertdialog`):
`useDialog` de Gluestack sobrescribe el rol de la plantilla.

| Prop                                   | Uso                                                                                                               |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `isOpen`                               | Apertura controlada.                                                                                              |
| `onClose`                              | Callback obligatorio.                                                                                             |
| `className`                            | Se aplica a `AlertDialogContent`, no a la raiz.                                                                   |
| `size`                                 | Tipado string o number; se reenvia a la primitiva. Preferir valores que esta implemente.                          |
| `avoidKeyboard`, `closeOnOverlayClick` | Se reenvian; verificar comportamiento por plataforma.                                                             |
| `isKeyboardDismissable`                | Se reenvia; con `false`, en web el wrapper ignora la solicitud de cierre que la primitiva emite al soltar Escape. |
| `children`                             | Contenido del dialogo.                                                                                            |

Siempre compone backdrop y content. La raiz usa
`className="relative flex flex-1"`. Miembros:
`AlertDialog.Header`, `.Body`, `.Footer`, `.Close`. Body combina `py-4` con
sus clases.
La implementacion tambien exporta `Header`, `Body`, `Footer` y una funcion
nombrada `AlertDialog`; no confundir ese import directo con la version
compuesta default que reexporta el barrel.

```tsx
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

<AlertDialog
  isOpen={open}
  onClose={onClose}
>
  <AlertDialog.Header>
    <Heading size="md">Confirmar operacion</Heading>
  </AlertDialog.Header>
  <AlertDialog.Body>
    <Text>Revisa la informacion.</Text>
  </AlertDialog.Body>
  <AlertDialog.Footer>
    <Button
      variant="light"
      onPress={onClose}
    >
      Cancelar
    </Button>
    <Button
      indeterminate={busy}
      onPress={onConfirm}
    >
      Confirmar
    </Button>
  </AlertDialog.Footer>
</AlertDialog>;
```

Los valores/callbacks son del consumidor. Conservar foco y un mecanismo de
cancelacion apropiado, y presentar el error cuando la operacion falle.

## Modal

Fuente: [Modal.tsx](../modal/Modal.tsx).
Se monta siempre cerrado y se abre tras el primer render, aunque reciba
`isOpen` desde el inicio: con `@gluestack-ui/core` 5 y las plantillas desde v4, un
overlay renderizado abierto en su montaje no se desmonta al cerrarse.
Importar `Modal` desde la carpeta; miembros `.Header`, `.Title`, `.Body`,
`.Footer`. Los exports `ModalHeader`, `ModalTitle`, `ModalBody`,
`ModalActions` estan en la implementacion, no en el barrel. Todos los tipos
de props se exportan desde la carpeta, incluido `ModalFooterProps` como
alias de `ModalActionsProps`.

| Prop                               | Comportamiento real                                                                                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isOpen`                           | `false` por defecto; sincroniza un estado local de apertura.                                                                                                         |
| `backdrop`                         | `true` por defecto; con `false` no hay fondo ni cierre al pulsar fuera.                                                                                              |
| `closable`                         | `false` por defecto; se inyecta a los hijos directos que sean exactamente `ModalHeader` y muestra el boton "Cerrar".                                                 |
| `onClose`                          | Al cerrar con backdrop, Escape (web), atras (Android) o el boton de `closable`, el modal se oculta y despues llama `onClose`.                                        |
| `size`                             | `md` por defecto: `xs` 360px, `sm` 420px, `md` 510px, `lg` 640px y `xl` 800px de ancho maximo (`xl` lo agrega el wrapper con `w-[95%]`); `full` ocupa todo el ancho. |
| `className`                        | Se aplica a `ModalContent` y se combina con la clase del `size`.                                                                                                     |
| `closeOnOverlayClick`              | `true` por defecto; con `false` pulsar el backdrop no cierra.                                                                                                        |
| `isKeyboardDismissable`            | `true` por defecto; con `false`, en web se ignora la solicitud de cierre que la primitiva emite al soltar Escape (mismo arreglo que `AlertDialog`).                  |
| `avoidKeyboard`                    | Se reenvia a la primitiva; agrega un espaciador del alto del teclado.                                                                                                |
| `initialFocusRef`, `finalFocusRef` | Foco al abrir y al cerrar; sin ellos la primitiva enfoca el primer elemento del contenido y restaura el foco previo.                                                 |

El contrato sigue los nombres de `Modal` de `@gluestack-ui/core` 5.0.15 y los
de `AlertDialog`. No declara `defaultIsOpen`, `useRNModal` ni
`animationPreset`: el wrapper controla el montaje y la capa del
`OverlayProvider`.

```tsx
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Text } from '@/components/ui/text';

<Modal
  isOpen={open}
  size="lg"
  onClose={onClose}
>
  <Modal.Header>Detalle</Modal.Header>
  <Modal.Body>
    <Text>Contenido del registro.</Text>
  </Modal.Body>
  <Modal.Footer>
    <Button
      variant="light"
      onPress={onClose}
    >
      Cerrar
    </Button>
  </Modal.Footer>
</Modal>;
```

Un string en `Modal.Header` se convierte en `Modal.Title`. Body combina
`my-0 py-4` con sus clases y Footer representa `ModalFooter` sin padding
propio, con el mismo espaciado que `AlertDialog`.

`Modal.Body` reenvia su `ref` a una instancia de `ScrollView` de React Native.
Permite desplazamiento programatico con `scrollTo` y `scrollToEnd` tanto en
web como en nativo.

### Limites que no deben darse por resueltos

- A diferencia de `AlertDialog` y `Drawer`, el modal se oculta por si solo
  (`onClose: handleClose`) aunque el padre mantenga `isOpen`. El consumidor
  debe poner `isOpen` en `false` en `onClose`; si queda en `true`, no podra
  reabrirlo.
- `closable` agrega icono/cierre en Header. Su `ModalCloseButton` usa el
  cierre del propio modal; escuchar `onClose` en la raiz.
- Header envuelto en otro elemento no recibe la inyeccion de `closable`.
  Preferir hijos directos como en el ejemplo.

Para flujos nuevos elegir una API que cubra el caso y verificarla; no
duplicar todo el modal en cada modulo para ocultar estas diferencias.

## Drawer

Fuente: [Drawer.tsx](../drawer/Drawer.tsx).
Se monta siempre cerrado y se abre tras el primer render, aunque reciba
`isOpen` desde el inicio: con `@gluestack-ui/core` 5 y las plantillas desde v4, un
overlay renderizado abierto en su montaje no se desmonta al cerrarse.

| Prop       | Contrato                                                                                                                                                                                                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isOpen`   | Booleano obligatorio.                                                                                                                                                                                                                                                                              |
| `onClose`  | Callback obligatorio; solo solicita el cierre (backdrop, Escape, atras, `Drawer.Close`). El padre cierra.                                                                                                                                                                                          |
| `size`     | `md` por defecto. Con `left`/`right` fija el ancho: `xs` `w-1/3 sm:w-1/5`, `sm` `w-2/5 sm:w-1/4`, `md` `w-1/2`, `lg` `w-3/4`, `xl` `w-5/6`, `full`. Con `top`/`bottom`, el alto: `h-1/5`, `h-1/4`, `h-1/2`, `h-3/4`, `h-5/6`, `h-full`. El wrapper agrega `xs` y `xl`, que la plantilla no define. |
| `anchor`   | `left` por defecto; `left`, `right`, `top`, `bottom`.                                                                                                                                                                                                                                              |
| `children` | Contenido del panel.                                                                                                                                                                                                                                                                               |

Compone `TheDrawer`, backdrop y content. No consume una prop `className`
de raiz ni props arbitrarias; personalizar los miembros:
`Drawer.Header`, `.Body`, `.Footer`, `.Close`.
Los exports separados `DrawerBody`, `DrawerClose`, `DrawerFooter`,
`DrawerHeader` existen en el archivo, pero el barrel solo exporta `Drawer`.

```tsx
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

<Drawer
  isOpen={open}
  onClose={onClose}
  anchor="right"
  size="md"
>
  <Drawer.Header>
    <Heading size="md">Detalle</Heading>
  </Drawer.Header>
  <Drawer.Body>
    <Text>Informacion del registro.</Text>
  </Drawer.Body>
  <Drawer.Footer>
    <Button
      variant="light"
      onPress={onClose}
    >
      Cerrar
    </Button>
  </Drawer.Footer>
</Drawer>;
```

Referencia de negocio:
[ReceivingInfo](../../../apps/makinpos/receivings/components/ReceivingInfo.tsx).

## Portal

Fuente: [ui/portal](../portal/index.tsx) ->
[z/portal](../../z/portal/index.tsx).

Envuelve la primitiva de Gluestack con el contrato `PortalProps` (no es un
reexport directo): `isOpen`, `style`, `isKeyboardDismissable`,
`animationPreset`, `useRNModal`, `useRNModalOnAndroid`, `onRequestClose`.
Solo renderiza con `isOpen` en `true` y se desmonta en cuanto pasa a
`false`, sin importar su valor inicial (la primitiva conservaba visible un
overlay montado abierto). Al cerrarse se oculta de inmediato, sin animacion
de salida; tambien se puede montar condicionalmente
(`{busy && <Portal isOpen>...}`).
Sirve para sacar overlays del flujo visual de su contenedor; no es por
si mismo un modal ni agrega backdrop, foco, bloqueo de interaccion o
posicionamiento correcto.

`Loading` y `FixedAutocomplete` lo usan con objetivos distintos. Revisar
coordenadas, stacking, scroll y plataforma antes de reutilizar una posicion
calculada. En formularios ordinarios, `Select` ya monta su portal; no
envolver cada campo en uno nuevo.
