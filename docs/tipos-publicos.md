# Tipos publicos de UI

[Indice general](../README.md)

Las aplicaciones deben consumir componentes **y tipos de UI** desde
`@/components/ui/<carpeta>`. No necesitan importar interfaces de
`@gluestack-ui/*`, `components/z` ni archivos internos como `button/Button`.
Esto no cambia la ubicacion de DTOs, enums y tipos de negocio de cada modulo.

```tsx
import { Button, type ButtonProps } from '@/components/ui/button';
import {
  DataTable,
  type Column,
  type DataTableProps,
} from '@/components/ui/datatable';
import type { UploadFileListProps } from '@/components/ui/file-uploader';
import {
  Input,
  Select,
  type InputProps,
  type SelectOption,
} from '@/components/ui/form';
```

Los imports son ejemplos independientes; importar solo los nombres que se
utilizan. Los miembros compuestos tienen tipos propios desde la misma carpeta,
por ejemplo `ButtonTextProps`, `ModalBodyProps` y `DrawerHeaderProps`.

## Catalogo de exports de tipos

| Carpeta             | Tipos publicos                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accordion`         | `AccordionProps`, `AccordionItemProps`, `AccordionHeaderProps`, `AccordionTriggerProps`, `AccordionTitleProps`, `AccordionContentProps`, `AccordionDividerProps`                                                                                                                                                                                                                                                                    |
| `alert`             | `AlertProps`, `AlertHeadingProps`                                                                                                                                                                                                                                                                                                                                                                                                   |
| `alert-dialog`      | `AlertDialogProps`, `AlertDialogHeaderProps`, `AlertDialogBodyProps`, `AlertDialogFooterProps`, `AlertDialogCloseProps`                                                                                                                                                                                                                                                                                                             |
| `autocomplete`      | `AutocompleteProps<Item>`, `AutocompleteInputProps<Item>`, `AutocompleteSearchResult<Item>`                                                                                                                                                                                                                                                                                                                                         |
| `avatar`            | `AvatarProps`, `AvatarImageProps`, `AvatarFallbackTextProps`, `AvatarBadgeProps`                                                                                                                                                                                                                                                                                                                                                    |
| `badge`             | `BadgeProps`, `BadgeTextProps`, `BadgeIconProps`                                                                                                                                                                                                                                                                                                                                                                                    |
| `base64-file-input` | `Base64FileInputProps`, `Base64FileChange`, `Base64FileValue`                                                                                                                                                                                                                                                                                                                                                                       |
| `box`               | `BoxProps`                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `button`            | `ButtonProps`, `ButtonTextProps`, `ButtonIconProps`                                                                                                                                                                                                                                                                                                                                                                                 |
| `button-group`      | `ButtonGroupProps`; conserva `ButtonProps` como alias del grupo por compatibilidad                                                                                                                                                                                                                                                                                                                                                  |
| `card`              | `CardProps`, `CardBodyProps`, `CardTitleProps`, `CardImageProps`, `CardTextProps`, `CardActionsProps`                                                                                                                                                                                                                                                                                                                               |
| `center`            | `CenterProps`                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `checkbox`          | `CheckboxProps`, el mismo contrato que `form`                                                                                                                                                                                                                                                                                                                                                                                       |
| `confirm`           | `ConfirmProps`                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `datatable`         | `DataTableProps<T>`, `Column<T>`, `PaginationChange`, `SimplePaginationLinksProps`, `DynamicProps`, `RowKey`, `RowSelection<T>`, `SelectionChange<T>`                                                                                                                                                                                                                                                                               |
| `divider`           | `DividerProps`                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `drawer`            | `DrawerProps`, `DrawerHeaderProps`, `DrawerBodyProps`, `DrawerFooterProps`, `DrawerCloseProps`                                                                                                                                                                                                                                                                                                                                      |
| `dropdown`          | `DropdownProps`, `DropdownToggleProps`, `DropdownMenuProps`, `DropdownItemProps`, `DropdownDividerProps`, `ComponentColor`                                                                                                                                                                                                                                                                                                          |
| `editable`          | `EditableProps`                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `empty-state`       | `EmptyStateProps`                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `file-uploader`     | `FileUploaderProps`, `UploadFileListProps`, `UploadFileCollection`                                                                                                                                                                                                                                                                                                                                                                  |
| `flat-list`         | `FlatListProps<Item>`, `ListRenderItem<Item>`, `ListRenderItemInfo<Item>`                                                                                                                                                                                                                                                                                                                                                           |
| `form`              | `FormProps`, `InputProps`, `InputTextProps`, `InputFieldProps`, `InputRef`, `DateInputProps`, `SelectProps`, `SelectOption`, `CheckboxProps`, `TextareaProps`, `RadioProps`, `CheckProps`, `ControlProps`, `GroupProps`, `LabelProps`, `HelperTextProps`, `InputWrapperProps`, `ErrorProps`, `ErrorItem`, `FormTextProps`, `SearchBoxProps`, `FileInputProps`, `FileInputAsset`, `FixedAutocompleteProps`, `AutocompleteSuggestion` |
| `form-control`      | `FormControlProps`                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `grid`              | `GridProps`, `RowProps`, `ColProps`                                                                                                                                                                                                                                                                                                                                                                                                 |
| `heading`           | `HeadingProps`                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `hstack`            | `HStackProps`                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `icon`              | `IconProps`, `UIIconProps`, `CreateIconOptions`                                                                                                                                                                                                                                                                                                                                                                                     |
| `image`             | `ImageProps`                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `link`              | `LinkProps`, `LinkTextProps`, `ExternalLinkProps`                                                                                                                                                                                                                                                                                                                                                                                   |
| `loading`           | `LoadingProps`                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `modal`             | `ModalProps`, `ModalHeaderProps`, `ModalTitleProps`, `ModalBodyProps`, `ModalActionsProps`, `ModalFooterProps`                                                                                                                                                                                                                                                                                                                      |
| `panel-options`     | `PanelOptionsProps`, `PanelOptionItem`                                                                                                                                                                                                                                                                                                                                                                                              |
| `portal`            | `PortalProps`                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `pressable`         | `PressableProps`                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `preview-controls`  | `PreviewControlsProps`                                                                                                                                                                                                                                                                                                                                                                                                              |
| `quantity-stepper`  | `QuantityStepperProps`                                                                                                                                                                                                                                                                                                                                                                                                              |
| `safe-area-view`    | `SafeAreaViewProps`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `scroll-view`       | `ScrollViewProps`                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `spinner`           | `SpinnerProps`                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `stats`             | `StatsProps`, `Stat`                                                                                                                                                                                                                                                                                                                                                                                                                |
| `stepper`           | `StepperProps`, `Step`, `StepperOrientation`, `StepperMobileIndicator`, `StepperLabelPlacement`                                                                                                                                                                                                                                                                                                                                     |
| `sticky-footer`     | `StickyFooterProps`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `switch`            | `SwitchProps`                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `tabs`              | `TabsProps`, `Tab`                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `text`              | `TextProps`                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `toast`             | `ToastProps`, `ToastTitleProps`, `ToastDescriptionProps`, `ToastController`, `ToastShowOptions`                                                                                                                                                                                                                                                                                                                                     |
| `tooltip`           | `TooltipProps`, `TooltipContentProps`, `TooltipTextProps`                                                                                                                                                                                                                                                                                                                                                                           |
| `view`              | `ViewProps`                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `vstack`            | `VStackProps`                                                                                                                                                                                                                                                                                                                                                                                                                       |

`InputWrapper`, `Error`, `SearchBox`, `FileInput`, `FixedAutocomplete`,
`form/Text` y `UploadFileList` mantienen sus imports de **valor** directos;
sus tipos si se pueden importar desde el barrel publico de su carpeta.
Exportar el tipo no agrega un export de valor ni cambia la composicion.

## Contratos congelados

Las props de `components/ui` estan congeladas para poder actualizar
Gluestack sin cambiar el contrato de las aplicaciones. Cada componente
declara sus props explicitamente con tipos de React, React Native o DOM y
con los valores que acepta hoy cada variante (`size`, `variant`, `action`,
`space`, etc.); ninguna se deriva de `components/z` ni de `@gluestack-ui/*`.

- Los valores reexportados se tipan con su contrato:
  `const Box: FunctionComponent<BoxProps> = TheBox`. Si la primitiva deja de
  aceptar esas props, el error aparece en `components/ui`.
- `withFrozenProps<Props>(primitive)` ([primitive.ts](../primitive.ts)) se usa
  con primitivas creadas por Gluestack (`createAccordion`, `createButton`,
  `createPressable`, etc.). Comprueba todas las props salvo `ref`, porque esos
  creadores declaran el ref con el tipo de sus props en lugar de la instancia
  real; el contrato congelado declara la instancia (`View`, `Text`,
  `Pressable`, `ScrollView`, `TextInput`, `Image` o `Svg`). No cambia runtime.
- `withFrozenProps<Props, VariantKeys>(primitive)` excluye tambien de la
  comprobacion las claves de variante indicadas. Desde `@gluestack-ui/utils` 5,
  `VariantProps` exige uniones literales (`'sm' | 'md'`, `boolean`) y ya no
  acepta el `string | number` congelado; `tva` sigue ignorando en runtime los
  valores que la plantilla no define. `TextVariantKeys` (`size`, `bold`,
  `italic`, etc.) y `StackVariantKeys` (`space`, `reversed`) agrupan las de
  texto y pilas. Indicar solo las variantes que la primitiva resuelve con
  `tva`; el resto de las props se sigue comprobando.
- Cuando un wrapper pasa una variante congelada a una primitiva en JSX
  (`Drawer`, `Modal`, `Switch`, `InputWrapper`, `Select`), declarar la
  primitiva con `withFrozenProps` y su tipo congelado, o usar el componente de
  `components/ui` equivalente (`Heading`, `HStack`, `VStack`, `Text`), en lugar
  de usar la de `components/z` con un cast.
- Con las plantillas v4/v5 (ver [Tema y tokens](tema.md)) varias variantes
  dejaron de existir en `components/z`; en particular `action`, que en v3
  elegia el color junto con `variant`. Los wrappers conservan la paleta v3
  (ver [Variantes de las primitivas](tema.md#variantes-de-las-primitivas)):
  `Button`, `Badge`, `Alert` y `Toast` reciben el color en `variant`
  (equivalente a `action`) y la forma en `outline`, los traducen a las clases
  v3 de `action`/`variant` y las heredan a `Button.Text`/`Button.Icon`,
  `Badge.Text`/`Badge.Icon` y `Toast.Title`/`Toast.Description`;
  `Accordion` conserva el fondo de `variant` (`filled`/`unfilled`) en la raiz
  y en `Accordion.Item`; `Link.Text` conserva el color `info`; `Input` (via
  `form/InputRoot`) conserva las alturas de `size` y la forma de `variant`;
  `Avatar` conserva las medidas de `size`; `Checkbox` conserva el tamano `md`
  de v3. `Accordion` ignora `size`.
- Las variantes conservan el tipo que tenian al congelarse: varias aceptan
  `string | number` porque asi las resolvia `VariantProps`, y otras ya eran
  uniones literales (`Badge.Text`, `Toast.Title`). Restringirlas es un cambio
  de contrato, no parte de la migracion.
- `parentVariants`, plomeria interna de Gluestack para heredar estilos del
  padre, no forma parte del contrato de `Button.Text` ni `Button.Icon`.
- `box`, `center`, `vstack`, `hstack`, `text`, `heading`, `grid` y `card`
  tienen primitivas distintas en web, por lo que congelan su contrato en
  `types.ts` (nativo, View/Text) y `types.web.ts` (div/span/h1). Por ejemplo,
  `Text` es span en web y RNText en nativo.
- Como TypeScript resuelve el contrato nativo, las pantallas pasan props de
  `View` a `Box`, `Center`, `VStack`, `HStack`, `Card` y `Grid`. En web,
  [dom-view-props.web.tsx](../dom-view-props.web.tsx) las traduce antes del
  `div` (`accessibilityLabel` → `aria-label`, `accessibilityRole` → `role`,
  `testID` → `data-testid`, `accessibilityElementsHidden` → `aria-hidden`,
  `pointerEvents` `auto`/`none` → estilo) y descarta las que no tienen
  equivalente (`accessible`, `onLayout`, `hitSlop`…), para que React DOM no
  las publique como atributos desconocidos.
- La accesibilidad se escribe una sola vez con `aria-*` (web) o con las
  props `accessibility*` (React Native):
  [platformAccessibilityProps](../accessibility/index.ts) las convierte al
  formato de la plataforma. En Android e iOS
  ([convert.ts](../accessibility/convert.ts)) `aria-label` →
  `accessibilityLabel`, `aria-checked`/`aria-disabled`/... →
  `accessibilityState`, `aria-value*` → `accessibilityValue`, `aria-hidden` →
  `accessibilityElementsHidden` e `importantForAccessibility`, `aria-live` →
  `accessibilityLiveRegion`; en web ([convert.web.ts](../accessibility/convert.web.ts))
  la conversion es la inversa. Las props explicitas de la plataforma
  prevalecen. `withDomViewProps` la aplica en ambas plataformas y los
  controles de formulario calculan su nombre con `accessibleName`
  (`aria-label`, `accessibilityLabel` y despues la etiqueta visible).
- `Icon`, `UIIcon` y `createIcon` usan el contrato nativo en ambas
  plataformas: las declaraciones web de la primitiva omitian `as`.
- Al migrar, adaptar las primitivas o los wrappers hasta que vuelvan a
  aceptar el contrato congelado; no reemplazar el tipo publico por el de la
  nueva version.

## Contratos de wrappers y primitivas

- [svg-web.d.ts](../icon/svg-web.d.ts) completa los exports omitidos por
  las declaraciones web de react-native-svg (`SvgProps` e hijos de `Defs`).
  No cambia runtime ni agrega props sin tipo; revisar si el proveedor corrige
  sus declaraciones al actualizar la dependencia.
- Los wrappers con nombres propios declaran las props que transforman,
  como `ImageProps.src`, `AvatarProps.text`, `SelectOption` o
  `InputWrapperProps.error`. Un tipo derivado no debe ocultar todo como `any`.
- `InputRef` describe el TextInput real para foco/medicion; tambien sirve
  al ref de `Autocomplete`, sin importar tipos de la primitiva.
- `InputFieldProps` adapta las declaraciones de tipo/ref dentro de
  `components/ui`, compartidas por `Input`, `Control` y `FormControl`.
  Se construye sobre `InputFieldPrimitiveProps`, el contrato congelado del
  campo de texto primitivo (no exportado por el barrel).
  No requiere cambios en `components/z` ni agrega un export de valor
  de `InputField` al barrel.
- `InputProps` discrimina `type="file"` (evento DOM) de `InputTextProps`
  (texto nativo). No mezclar `onChangeText` con la rama de archivos.
- `CardTitleProps` describe props de Heading, no `typeof Heading`;
  `CardImageProps` describe las props de imagen con `src`, y
  `CardActionsProps` las de HStack.
- `CheckProps`, `ControlProps` y `FormControlProps` discriminan por `type`
  o `as` para que callbacks y valores correspondan al control.
  Por ejemplo, `FormControl type="select"` usa opciones string y
  `onValueChange`; `type="checkbox"` usa `isChecked` y `onChange(boolean)`.
- En la rama DOM file de `FormControl`, `size` corresponde al atributo
  numerico del input. No usar alli una variante de tamano de texto.
- `CheckboxProps.value` es opcional; sin valor se transmite una cadena
  vacia a la primitiva. El estado booleano se controla con `isChecked`.
- `EditableProps.placeholder` puede ser JSX para la vista de presentacion,
  pero al campo de edicion solo se transmite un placeholder string.
- `UploadFileListProps.onDelete` recibe `(index: number, file?: File)`,
  igual que `FileUploaderProps.onDelete`.
- `UploadFileCollection` admite `FileList` y arreglos readonly de `File`.
  `FileUploaderProps.onChange` siempre entrega un arreglo `File[]`.

El tipo no agrega funcionalidad ausente: `helperText`, cierre, paginacion,
ayudas de plataforma y props heredadas siguen las limitaciones de las
guias de cada componente.

## Extender tipos sin depender de Gluestack

```tsx
import { Button, type ButtonProps } from '@/components/ui/button';
import type { SelectOption } from '@/components/ui/form';

type SaveButtonProps = Omit<ButtonProps, 'children' | 'onPress'> & {
  onSave: () => void;
};

function SaveButton({ onSave, ...props }: SaveButtonProps) {
  return (
    <Button
      {...props}
      onPress={onSave}
    >
      Guardar
    </Button>
  );
}

const options: SelectOption[] = [{ value: '01', label: 'Primera opcion' }];
```

El ejemplo ilustra composicion tipada, no recomienda crear un wrapper de
guardar en cada modulo: preferir `FormLayout` o `Button` directo cuando
cubran la necesidad.

Para una prop individual, derivar del contrato publico:
`ButtonProps['size']`, `SelectProps['onValueChange']` o
`UploadFileListProps['onDelete']`. No hace falta importar un tipo de
evento/callback de Gluestack.

## Mantenimiento y comprobacion

Agregar los tipos de componentes nuevos y miembros compuestos al barrel
correspondiente; mantener este indice y las guias de comportamiento.
Los tests deben ser archivos hermanos del archivo o componente probado, en la
misma carpeta; no los coloques en carpetas `__tests__`.
Todos los tests de componentes, layouts y demos usan TypeScript y Jest/Expo:

```sh
npm test -- --runInBand
npm test -- --runInBand components/ui core/layout pages/demo
npm run typecheck
npm run typecheck:tests
npm run typecheck:tests:web
```

`npm test` ejecuta Jest nativo/web. Los selectores `--runTestsByPath` y
`--selectProjects` limitan los archivos y la plataforma.

`jest.config.cjs` separa `.test.ts`/`.test.tsx` (nativo) de
`.test.web.ts`/`.test.web.tsx` (web, con jsdom y resolucion `.web`).
Cada proyecto carga un setup global de `testing/`: react-aria (>=3.48) instala
en `NODE_ENV=test` un polyfill que lee `window.screen` y define
`window.visualViewport`. `setupNative.ts` crea `window.screen` en jest-expo
nativo y `setupWeb.ts` declara `visualViewport` como `undefined` para que
react-native-web siga midiendo con `documentElement.clientWidth`, como simulan
las pruebas. `setupReanimated.ts` sustituye react-native-reanimated por
[mocks/reanimated.tsx](../../../testing/mocks/reanimated.tsx) en ambos
proyectos: las plantillas v4/v5 animan con reanimated 4, cuyo runtime de
worklets no existe en Jest (ni su mock oficial carga). El mock cubre solo la
API que usan las plantillas; las animaciones terminan de inmediato. Ninguno
afecta el runtime de la app.
Usar `@testing-library/react-native` para renderizado/eventos nativos y
`@testing-library/react` con `@testing-library/user-event` para DOM.
Consultar por rol, nombre accesible y texto, e interactuar con los componentes
reales. Los mocks se reservan para fronteras externas que lo requieran.
Las regresiones de composicion se comprueban por su efecto observable (texto,
rol, estado accesible, eventos emitidos por una interaccion real), no
inspeccionando props de primitivas ni consultando el arbol por tipo. No crear
renderers, consultas universales por tipo ni componentes falsos que sustituyan
primitivas; se eliminaron `testing/ui/renderContract.ts`,
`renderWebContract.tsx` y `testing/ui/host.tsx`.
RNTL 14 tiene `render`, `renderHook`, `act`, `rerender` y `unmount` asincronos:
invocarlos directamente y dejar la limpieza automatica a Testing Library.
Restaurar spies con `jest.restoreAllMocks()`; temporizadores, propiedades
globales y recursos externos se liberan con `afterEach` o `try/finally`, sin
`testWithCleanup`. `userEvent` representa interacciones reales y no espera
la promesa de un handler; `fireEvent` sirve para contratos de eventos especificos
y espera su retorno, por lo que no debe bloquear una prueba con una peticion
pendiente. No se mockean primitivas de UI: las pruebas usan controles reales.
El loader aislado se mantiene solo donde se necesitan variantes de plataforma
o dependencias locales sinteticas; no participa en el renderizado.
`Button.test.tsx` y `Button.test.web.tsx` cubren activacion, bloqueo y reentrada;
`hooks/useValidator.test.ts` ejemplifica `renderHook` con callbacks tipados.

Jest/Babel solo transpila: los comandos de tipos son obligatorios para detectar
errores en tests, fixtures y callbacks. Incluyen las fuentes importadas y pueden
fallar por errores previos de esas fuentes,
sin desactivarlos ni sustituir contratos por `any`.

La migracion completa conserva las comprobaciones y regresiones locales,
incluidas expectativas previamente fallidas: un fallo del contrato no se
convierte en un test omitido ni en una correccion incidental del componente.
No quedan tests `.cjs` en UI, `core/layout` ni `pages/demo`.
`generate-snippets.cjs` sigue siendo el generador de las demos, no un test.

La comprobacion de tipos publicos revisa todas las carpetas, los tipos
exportados por sus implementaciones, contratos de callbacks y que las
props no sean `any`/`unknown`, tanto con resolucion nativa como `.web`.
Tambien detecta imports directos de tipos Gluestack/primitivas fuera de
la capa permitida. No sustituye el chequeo global `tsc --noEmit` ni
la comprobacion visual/interactiva de cada flujo.
