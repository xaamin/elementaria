# Formularios y controles

[Indice general](../README.md) / [Datos y archivos](datos-y-archivos.md)

## Exports y composicion

El barrel [form/index.tsx](../form/index.tsx) exporta `Form`, `Input`, `Select`,
`DateInput`, `Checkbox`, `Textarea`, `Check`, `Radio`, `Control`, `Group`, `Label` y
`HelperText`. Todos los controles de esa lista tambien existen como miembros
de `Form`, por ejemplo `Form.Input` y `Form.Group`.

Importaciones directas, **no** incluidas en el barrel:

| Ruta despues de `@/components/ui/` | Export                                                  |
| ---------------------------------- | ------------------------------------------------------- |
| `form/InputWrapper`                | `InputWrapper`                                          |
| `form/Error`                       | `Error`                                                 |
| `form/Text`                        | `Text` auxiliar de formulario                           |
| `form/SearchBox`                   | `SearchBox`                                             |
| `form/FileInput`                   | `FileInput` (preferir `Input type="file"`)              |
| `form/FixedAutocomplete`           | `FixedAutocomplete`                                     |
| `form-control`                     | `FormControl` y su alias `FormInput`                    |
| `checkbox`                         | El mismo `Checkbox` de `form/Checkbox`, no otro control |
| `switch`                           | `Switch`                                                |

Los tipos de esos componentes, incluidos `FileInputProps`, `FileInputAsset`,
`InputWrapperProps`, `SearchBoxProps` y `FixedAutocompleteProps`, si se
exportan desde el barrel `@/components/ui/form`.

`Form` envuelve su contenido en un `VStack` con `flex-1`. En web coloca dentro
un `<form>` DOM con `flex flex-1 flex-col gap-4`, combina su `className` con
esas clases y reenvia las demas props al `<form>`; su `onSubmit` por defecto
solo llama `preventDefault()`, y un `onSubmit` recibido lo reemplaza. En
Android e iOS renderiza en su lugar un `VStack` con las mismas clases: no
existe envio nativo. En ninguna plataforma conecta el envio a `useValidator`.

Para una pantalla de guardado, preferir
[FormLayout](../../../core/layout/FormLayout.tsx): integra scroll, botones
Cancelar/Guardar, `busy`, pie de acciones y `ResponseError` para `error`.
Su boton Guardar invoca `onSubmit`; pasar `handleSubmit(save)`, no el guardado
sin validar. El layout usa `Form`, por lo que el guardado depende de ese boton
y no de un envio del formulario.

## InputWrapper y errores

Fuente: [InputWrapper.tsx](../form/InputWrapper.tsx).

Es la composicion comun de `FormControl` de Gluestack, `Label`, hijos,
`HelperText` y `Error`. No confundirla con el selector de controles
`@/components/ui/form-control`.

| Prop                                     | Efecto                                                      |
| ---------------------------------------- | ----------------------------------------------------------- |
| `children`                               | Control especializado que se coloca entre etiqueta y ayuda. |
| `label`                                  | Se muestra cuando es truthy.                                |
| `containerClassName`                     | Se combina con `grow` en el contenedor. No usa `className`. |
| `error`                                  | Mensaje o mensajes enviados a `Error`.                      |
| `isFieldDirty`                           | Junto con un `error` truthy activa invalidez.               |
| `isInvalid`                              | Fuerza invalidez aunque no haya mensaje.                    |
| `isRequired`, `isDisabled`, `isReadOnly` | Estado del contenedor de formulario.                        |
| `required`                               | Alias de `isRequired`; ambos se combinan.                   |
| `helperText`                             | Se representa si es distinto de `undefined`.                |
| `size`                                   | Se transmite a la primitiva `FormControl`.                  |

La expresion de invalidez es `!!error && isFieldDirty || isInvalid`.
Esta expresion controla tambien la visibilidad del mensaje: `InputWrapper`
solo monta `Error` cuando el campo es invalido. `Error` por si mismo muestra
el contenido recibido sin consultar el formulario.

[Error](../form/Error.tsx) acepta strings, arreglos de strings o de objetos
`{ message: string }`, booleanos y objetos con `errors: { message: string }[]`.
Con string presenta un mensaje y un icono de alerta; con arreglo o `errors`
presenta cada mensaje de la lista.
`false`, cadena vacia y `true` no producen contenido. `true` puede marcar un
estado invalido desde el wrapper, pero no es texto explicativo.

`Error` usa `HStack`, `Text` e `Icon`, sin contexto ni proveedor de formulario.
Conserva el color `error-700`, el icono de alerta de 18px y la fila con margen
superior y separacion entre elementos. Expone `role="alert"` y funciona igual
dentro de un campo o de forma independiente, como en `ResponseError`.
No registra feedback ni genera `aria-describedby` en el control padre.
El `message` superior de un objeto con `errors` no se representa: se muestran
los mensajes de la lista.

Todos los controles que usan `InputWrapper` (`Input`, `Select`, `Checkbox`,
`Textarea`, `SearchBox`, `DateInput` y `FileInput`) le transmiten
`helperText` y convierten `required` en `isRequired`. El estado obligatorio
se publica a la primitiva mediante el contexto del `FormControl`, que lo
expone como `aria-required`; `Label` no dibuja un asterisco.

## Input

Fuente: [Input.tsx](../form/Input.tsx).

```tsx
import { Input } from '@/components/ui/form';

<Input
  label="Codigo postal"
  value={codigoPostal}
  onChangeText={setCodigoPostal}
  keyboardType="number-pad"
  isRequired
/>;
```

El ejemplo supone estado string del consumidor. Un teclado numerico no cambia
el valor a numero ni debe eliminar ceros iniciales.

| Prop                                                        | Contrato                                                                                                                                                                      |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                                                      | `text` por defecto; ver [efecto de cada tipo](#tipos-de-input).                                                                                                               |
| `value`, `onChangeText`                                     | Campo controlado. Solo `undefined` se convierte a `''`; normalizar otros valores en el consumidor.                                                                            |
| `label`, `error`, `isFieldDirty`, `isInvalid`, `isRequired` | Composicion de `InputWrapper`; `required` es alias de `isRequired`.                                                                                                           |
| `isDisabled` / `disabled`                                   | Ambas se combinan para deshabilitar la primitiva Input; preferir `isDisabled`.                                                                                                |
| `isReadOnly` / `readonly`                                   | Ambas se combinan para solo lectura.                                                                                                                                          |
| `size`                                                      | Altura del contenedor: `sm` `h-9`, `md` `h-10` (defecto), `lg` `h-11`, `xl` `h-12`.                                                                                           |
| `containerClassName`                                        | Clase del `InputWrapper`.                                                                                                                                                     |
| `inputClassName`                                            | Clase del borde/contenedor Input.                                                                                                                                             |
| `className` y demas props de `InputField`                   | Se reenvian al campo, no al contenedor.                                                                                                                                       |
| `variant`                                                   | Forma del borde del contenedor: `outline` (defecto, borde completo), `underlined` (solo borde inferior, sin esquinas ni padding horizontal) o `rounded` (esquinas completas). |
| `helperText`                                                | Texto de ayuda de `InputWrapper`.                                                                                                                                             |
| `children`                                                  | Slot adicional dentro de Input, despues del campo.                                                                                                                            |

### Tipos de Input

`type="password"` oculta el texto y agrega el boton "Mostrar
contraseña"/"Ocultar contraseña". El estado de visibilidad es local y se
reinicia al remontar.

`number`, `email`, `tel` y `url` eligen el teclado nativo y el `<input>` web.
En nativo `TextInput` no usa `type`, y react-native-web deriva el `type` y el
`inputmode` del `<input>` de `keyboardType`/`inputMode`; por eso `Input`
traduce cada tipo a esas props:

| `type`   | Props por defecto                                                                                      | Web                                       |
| -------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `number` | `keyboardType="numeric"`                                                                               | `<input type="text" inputmode="numeric">` |
| `email`  | `keyboardType="email-address"`, `autoCapitalize="none"`, `autoComplete="email"`, `autoCorrect={false}` | `<input type="email">`                    |
| `tel`    | `keyboardType="phone-pad"`, `autoComplete="tel"`                                                       | `<input type="tel">`                      |
| `url`    | `keyboardType="url"`, `autoCapitalize="none"`, `autoCorrect={false}`                                   | `<input type="url">`                      |

Las props explicitas del consumidor prevalecen: con `keyboardType` o
`inputMode` propios no se aplica el teclado del tipo (por ejemplo,
`type="number" keyboardType="decimal-pad"` da `inputmode="decimal"`), y
`autoCapitalize`, `autoComplete` o `autoCorrect` propios reemplazan los del
tipo. `number` no produce `<input type="number">` (sin flechas ni validacion
del navegador). Ningun tipo implementa conversion ni restricciones de
negocio; `onChangeText` sigue entregando texto.

`type="file"` cambia la API: `Input` renderiza [FileInput](#fileinput) en web,
Android e iOS. Recibe `onChange(FileInputAsset[])`, `onError`, `accept`,
`multiple` y `placeholder`; no acepta `value` ni `onChangeText`.
`InputProps` discrimina esta rama (`FileInputProps & { type: 'file' }`) de
`InputTextProps`. Es la forma recomendada de pedir archivos:

```tsx
import { useState } from 'react';

import { Input } from '@/components/ui/form';
import type { FileInputAsset } from '@/components/ui/form';

function Comprobantes() {
  const [files, setFiles] = useState<FileInputAsset[]>([]);

  return (
    <Input
      type="file"
      label="Comprobantes"
      accept=".pdf,.xml"
      multiple
      onChange={setFiles}
    />
  );
}
```

Un archivo fuera de `accept` ya muestra su error bajo el campo; `onError`
solo es necesario si el consumidor tambien debe reaccionar al rechazo.

Para una seleccion acumulada o editable consultar
[FileUploader](datos-y-archivos.md#fileuploader).

## DateInput

`DateInput` y `DateInputProps` se importan desde `@/components/ui/form`.
Usa `value` y `onChangeText` con un dia ISO `AAAA-MM-DD`. Web presenta un
calendario identico a iOS y Android: una unica implementacion compartida con
`@marceloterreiro/flash-calendar`, sin controles de fecha del navegador ni de
SwiftUI. El campo abre un modal con el mes seleccionado (o el actual si esta
vacio o es invalido), navegacion mensual y calendario en espanol, con semanas
desde el lunes y tema claro/oscuro de NativeWind. Seleccionar un dia o pulsar
Hoy emite el dia ISO y cierra; Limpiar emite `''`; Cancelar, Escape, atras o
cerrar el modal no cambian el valor. No incluye horas ni convierte zonas horarias.
Cada campo aisla su seleccion mediante un identificador de calendario propio.

`presentation="modal"` es el valor predeterminado y mantiene el modal en todas
las plataformas. Con `presentation="auto"`, web muestra un panel anclado al
campo desde `md` (768 px); en `xs` y `sm` (menos de 768 px), iOS y Android
mantiene el modal. El panel tiene 360 px de ancho, limitado por la ventana;
prefiere abrir debajo y puede abrir arriba si no hay espacio. Usa el overlay
de Popover para no quedar recortado por el formulario, cierra al pulsar fuera
o Escape, devuelve el foco al campo y conserva las mismas acciones del modal.
Cambiar el ancho con el calendario abierto conserva el mes visible y no emite
una seleccion.

El panel web no repite visualmente la etiqueta por defecto. Usa
`showPanelLabel={true}` para mostrarla dentro del panel. Esta prop no oculta
la etiqueta del campo ni el titulo del modal; el panel conserva su nombre
accesible aunque la etiqueta interior no sea visible.

Comparte etiqueta, errores, obligatoriedad y clases del contenedor mediante
`InputWrapper`. `disabled`/`isDisabled` y `readonly`/`isReadOnly` bloquean tambien
el callback y ocultan el calendario si se bloquea mientras esta abierto.
`inputClassName` estiliza el control y `accessibilityLabel` nombra el campo y
el modal en las tres plataformas cuando la etiqueta no es texto. No acepta
`helperText`. La entrada no admite escritura libre.
La composicion de fecha/hora y la validacion del documento pertenecen al consumidor.

## Select

Fuente: [Select.tsx](../form/Select.tsx).

```tsx
import { Select } from '@/components/ui/form';

<Select
  label="Tipo"
  placeholder="Selecciona"
  options={[
    { value: '01', label: 'Primera opcion' },
    { value: '02', label: 'No disponible', disabled: true },
  ]}
  value={tipo}
  onValueChange={setTipo}
/>;
```

| Prop                                                                | Contrato                                                                             |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `options`                                                           | Arreglo `{ value, label, disabled? }`, por defecto `[]`. Usar valores string unicos. |
| `value`                                                             | Busca la opcion mediante igualdad estricta con `option.value`.                       |
| `onValueChange`                                                     | Recibe el valor seleccionado, no el objeto ni la etiqueta.                           |
| `onChange`                                                          | Si existe, **sustituye** a `onValueChange`; no se ejecutan ambos.                    |
| `placeholder`                                                       | Texto si no hay opcion encontrada; el texto seleccionado es `option.label`.          |
| `label`, `error`, `isFieldDirty`, `isInvalid`, `isRequired`, `size` | Estado del wrapper.                                                                  |
| `containerClassName`                                                | Clase del wrapper.                                                                   |
| `isDisabled`, `isReadOnly`                                          | Se pasan al wrapper, no explicitamente a la raiz Select. Verificar interaccion real. |

Compone trigger outline, icono, portal, backdrop y lista de `SelectItem`.
Una opcion ausente de `options` se representa sin seleccion aunque `value`
tenga contenido. No convertir `'01'` a `1` ni comparar por etiqueta.
`children` se extrae pero no se representa; no admite opciones JSX por esa via.
`size` se pasa al wrapper y al trigger. Las props restantes llegan a la raiz.

## Checkbox

Fuente: [Checkbox.tsx](../form/Checkbox.tsx).

`isChecked` y `onChange(boolean)` son el contrato recomendado. Tambien
acepta `checked`, que se usa como valor inicial de la prop de la primitiva,
pero un `isChecked` presente en el spread posterior tiene prioridad.
No mezclar ambos nombres.

`isIndeterminate` muestra un signo menos para seleccion parcial; no cambia
el valor controlado de `isChecked`. El checkbox de cabecera de `DataTable`
usa este estado cuando solo algunas filas visibles estan seleccionadas.

- `children || label` forma el texto de `CheckboxLabel`.
- `helperText`, `error`, `isFieldDirty`, `isInvalid`, `isRequired`/`required`,
  `size` y `containerClassName` se usan en `InputWrapper`.
- `isDisabled` y su alias `disabled` se pasan al wrapper y bloquean la casilla
  mediante el contexto del `FormControl` interno. `isReadOnly` sigue el
  mismo camino.
- `size` se pasa al wrapper, no explicitamente al Checkbox interior.

Usar `bind('activo', { type: 'checkbox' })`: el hook considera seleccionado
solo el booleano `true`, no `'1'`, `1` ni `'true'`. Transformar valores de API
antes de precargar el formulario.

## Textarea

Fuente: [Textarea.tsx](../form/Textarea.tsx).

Usa `InputWrapper`, `TheTextarea` y `TextareaInput`. El enlace de texto es
`value` + `onChangeText`, por lo que sirve `bind('notas')`.
El wrapper recibe todas las props y admite `helperText`; `required`,
`disabled` y `readonly` se combinan con `isRequired`, `isDisabled` e
`isReadOnly`.

El bloqueo explicito de la raiz utiliza `disabled` y `readonly`; `isInvalid`
tambien se pasa a la raiz. El `size="md"` inicial puede ser reemplazado por
el spread restante. Otras props, incluido `className`, se propagan a raiz y
campo: comprobar el resultado visual antes de asumir que afectan solo a uno.

## Check y Radio

Fuentes: [Check.tsx](../form/Check.tsx), [Radio.tsx](../form/Radio.tsx).

`Check` es un despachador: `type="radio"` crea `Radio`; cualquier otro caso
crea `Checkbox`. No transforma valores.

Cada `Radio` crea su propio `RadioGroup`, un indicador circular, `label`
y `Error`. `disabled` se convierte a `isDisabled` del radio; el `label` de
texto nombra el radio y `onChange(true)` se emite al seleccionarlo. El resto
de props llega al radio, **no al grupo**. Por ello, varios `Form.Radio` vecinos
no forman automaticamente un grupo de seleccion exclusiva controlado.
Tampoco `bind(name, { type: 'radio' })` resuelve esa agrupacion: entrega
`onValueChange`, pero el wrapper no lo conecta a `RadioGroup`.

Para seleccion exclusiva multiple, revisar la composicion de
[las primitivas Radio](../../z/radio/index.tsx) en vez de copiar una
agrupacion que no controla el valor.

## FormControl y Control

Fuentes: [FormControl](../form-control/FormControl.tsx),
[Control](../form/Control.tsx).

Son dos APIs distintas:

Esta seccion describe componentes existentes, no la opcion recomendada para
pantallas nuevas. Evitar el `FormControl` generico e importar directamente
`Input` (o `Input type="file"`), `Select`, `Checkbox` o `Textarea` desde
`components/ui`.
Para mensajes generales usar `Alert`, sin montar un proveedor `FormControl`.

| Componente                      | Selector                                               | Resultado                                                         |
| ------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------- |
| `FormControl` de `form-control` | `type="select"`, `"checkbox"`, `"radio"`, `"textarea"` | Delega al control correspondiente de `form`.                      |
| `FormControl`                   | `type="file"`                                          | Delega a `FileInput`; `onChange` recibe `FileInputAsset[]`.       |
| `FormControl`                   | Otro `type`                                            | Campo de texto con `InputWrapper` y toggle de password.           |
| `Control` de `form`             | `as="select"` / `as="textarea"`                        | Delega a `Select` / `Textarea`.                                   |
| `Control`                       | Cualquier otro `as`                                    | Input de primitiva; `as` no elige un componente React arbitrario. |

En las ramas delegadas de `FormControl` se pasa explicitamente
`isInvalid={hasError || isInvalid}`, donde `hasError` es `!!error && isFieldDirty`.
`inputClassName` se extrae y no se reenvia a ninguna rama delegada;
`containerClassName` tampoco llega a select, checkbox, radio ni textarea,
pero si a la rama file. La rama de texto acepta `disabled`/`isDisabled` y
`readonly`/`isReadOnly`, como `Input`. `FormInput` es el mismo componente.

`Control` no incluye por si mismo etiqueta, ayuda ni error para su rama
de texto. Usa `variant="outline"` por defecto y mapea `disabled`,
`readonly`, `isInvalid`. Para nuevos formularios ordinarios, preferir los
controles dedicados de `form`, que hacen explicito el contrato.

## Auxiliares de formulario

| Componente y fuente                  | Comportamiento                                                                                                                                            |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Group](../form/Group.tsx)           | `VStack` con `w-full mb-3` y `className` combinado. Si se pasa `as={Componente}`, usa ese componente y no reenvia `className`.                            |
| [Label](../form/Label.tsx)           | `FormControlLabel`; envuelve hijos string en `Text`. Solo consume `children`, no es un wrapper generico de props.                                         |
| [HelperText](../form/HelperText.tsx) | `FormControlHelper` + `FormControlHelperText`. Solo consume `children`.                                                                                   |
| [Text](../form/Text.tsx)             | Variante auxiliar con `size="sm"` y `muted` convertido a clase `muted`. No es el `Text` del barrel `ui/text`. Las props restantes pueden reemplazar size. |

No usar `Label` para dar por hecho el indicador required de Gluestack:
su implementacion usa `Text`, no `FormControlLabelText`. `isRequired`
establece el estado del contenedor; comprobar la representacion requerida.

## Integracion detallada con useValidator

Fuente: [useValidator.tsx](../../../hooks/useValidator.tsx).
El hook usa ValidatorJS y mensajes en espanol. No es React Hook Form
ni infiere DTOs, objetos anidados o persistencia.

```tsx
import { Checkbox, Input, Select } from '@/components/ui/form';
import { FormLayout } from '@/core/layout/FormLayout';
import { useValidator } from '@/hooks/useValidator';

type Values = {
  nombre: string;
  tipo: string;
  activo: boolean;
};

const rules = {
  nombre: ['required', 'max:100'],
  tipo: ['required'],
};

const options = [{ value: '01', label: 'Primera opcion' }];

type Props = {
  data: Values;
  busy?: boolean;
  onSave: (values: Values) => Promise<void>;
  onCancel: () => void;
};

function Example({ data, busy, onSave, onCancel }: Props) {
  const { bind, handleSubmit } = useValidator<Values>(rules, data);

  return (
    <FormLayout
      busy={busy}
      onSubmit={handleSubmit(onSave)}
      onCancel={onCancel}
    >
      <Input
        label="Nombre"
        isRequired
        {...bind('nombre')}
      />
      <Select
        label="Tipo"
        options={options}
        isRequired
        {...bind('tipo', { type: 'select' })}
      />
      <Checkbox
        label="Activo"
        {...bind('activo', { type: 'checkbox' })}
      />
    </FormLayout>
  );
}
```

El consumidor sigue siendo responsable de sincronizar otro registro al
reutilizar una instancia montada y de presentar el error HTTP mediante
`FormLayout.error`.

| Miembro                               | Semantica                                                                                                                                                                   |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bind(name)`                          | `value`, `onChangeText`, `onBlur`, `name`, `required`, `error`, `isFieldDirty` y `onSubmitEditing` que cierra teclado. `name` no forma parte del contrato de los controles. |
| `bind(name, { type: 'password' })`    | Enlace de texto y `type`, sin el `onSubmitEditing` por defecto.                                                                                                             |
| `bind(name, { type: 'checkbox' })`    | `onChange` booleano e `isChecked` estricto; tambien entrega `value`.                                                                                                        |
| `bind(name, { type: 'select' })`      | `onValueChange` y `onClose` para validar al cerrar el selector; mismo estado de error/dirty.                                                                                |
| `handleSubmit(callback)`              | Devuelve callback sin argumentos: marca las claves de reglas, valida y llama al consumidor solo si pasa.                                                                    |
| `values`, `errors`, `isValid`         | Estado de valores y resultado de ValidatorJS. No indican estado HTTP.                                                                                                       |
| `set(values)`                         | Reinicia errores/campos y reemplaza los valores.                                                                                                                            |
| `sync(values)` / `syncValues(values)` | Mezcla valores con los actuales; no equivale a reemplazar ni limpia errores/campos.                                                                                         |
| `reset(onReset?)`                     | Limpia a `{}`, no restaura los valores iniciales.                                                                                                                           |
| `handleOnChange(partial)`             | Mezcla, notifica `config.onChange` con el parcial y marca la primera clave modificada.                                                                                      |
| `handleOnBlur(callback?, name?)`      | Valida si esta configurado y ejecuta el callback. Marca el campo indicado como validado; sin nombre, marca las claves de reglas. `bind` lo conecta automaticamente.         |

Consideraciones importantes:

1. `initialValues` inicializa, pero cambios posteriores de esa prop no
   resincronizan el formulario. Usar `set` al cambiar registro/contexto o
   remontar con identidad apropiada; evitar pisar la edicion con cada render.
2. `rules` acepta strings o arreglos de strings. Mantener su referencia
   estable; cambiar reglas dispara validacion. Recalcular solo cuando
   cambien condiciones relevantes.
3. La configuracion admite `onChange`, `onBlurValidation` y
   `onInputChangeValidation`. Por defecto, `onBlurValidation` es `true` y
   `onInputChangeValidation` es `false`: cada campo muestra su primer error
   al perder el foco, incluso si se deja vacio. Desde el primer blur o intento
   de envio, los cambios vuelven a validar; los errores de campos aun no
   abandonados permanecen ocultos. El envio habilita los errores de todas las
   claves de reglas. `set` y `reset` reinician este ciclo.
   `onInputChangeValidation: true` permite validar desde el primer cambio;
   `onBlurValidation: false` desactiva la validacion al salir y el filtro de
   errores por campo. Cambiar reglas recalcula la validez sin habilitar errores
   de campos aun no abandonados.
4. `bind` calcula `required` a partir de las reglas y los controles lo
   convierten en `isRequired` (`aria-required`). No agrega un asterisco a
   la etiqueta.
5. Los valores se leen con `values[name]`, no recorriendo rutas. Para claves
   como `direccion.cp`, aplanar datos y reconstruir el DTO al enviar.
6. No sustituir un callback enlazado sin actualizar el hook. Si se normaliza
   texto, usar el callback obtenido de `bind` o `handleOnChange`.
7. El callback de `handleSubmit` no espera ni devuelve la promesa de
   `onSubmit`: no usar su retorno como indicador de finalizacion.
   `busy`, errores, control de doble envio y resultado viven en el consumidor.
8. No enlazar archivos mediante `bind(..., { type: 'file' })` sin adaptar:
   ese enlace expone `onValueChange` y omite `isFieldDirty`, pero
   `Input type="file"` emite `onChange(FileInputAsset[])` y no usa `value`.
   Guardar los archivos con `handleOnChange` o en estado local.
9. No sincronizar credenciales o archivos sensibles al store, Storage o logs.
   Separar el estado local sensible del borrador de negocio.

## SearchBox

Fuente: [SearchBox.tsx](../form/SearchBox.tsx). Importar directamente.

Sin `value` mantiene texto local, inicialmente `''`; con `value` el campo es
controlado. `onSearch(text)` es obligatorio. Enter busca si `error` es falsy;
no busca en cada pulsacion.

- `onChangeText` recibe cada cambio, incluida la limpieza con X (`''`).
- `onKeyPress` se invoca antes de evaluar Enter.
- `helperText` y `required` se transmiten a `InputWrapper`; `children` es un
  slot dentro del campo, como en `Input`.
- Sin texto no blanco muestra lupa ("Buscar"); pulsarla busca el valor actual.
  Con texto muestra X ("Limpiar"), que limpia el campo **sin** llamar a
  `onSearch('')`. Ambos botones se bloquean junto con el campo.
- El `label` de texto nombra el campo.
- Usa los mismos nombres `inputClassName`, `containerClassName`,
  estados de wrapper y aliases de bloqueo que `Input`.

Si un listado necesita resetear filtros al limpiar, no asumir que ya ocurre.
El consumidor de referencia es [ListLayout](../../../core/layout/ListLayout.tsx).

## FileInput

Fuente: [FileInput.tsx](../form/FileInput.tsx). Web, Android e iOS.

Usar `<Input type="file" />` desde `@/components/ui/form`, con los tipos
`FileInputProps` y `FileInputAsset` del mismo barrel; importar
`form/FileInput` directamente solo si no se necesita el despachador de `Input`.

Abre el selector de `expo-document-picker` en todas las plataformas. Dentro
de `InputWrapper` renderiza una zona punteada pulsable con icono de subida
(en web, un `<button type="button">`); no hay `<input type="file">` DOM.
Admite `label`, `helperText`, estados de validacion y `containerClassName`;
`className` estiliza la zona pulsable y `children` se muestra despues de ella.

| Prop                                   | Contrato                                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `onChange`                             | Recibe `FileInputAsset[]` (`uri`, `name`, `mimeType`, `size`; en web tambien `file`). No se llama si el usuario cancela. |
| `accept`                               | Lista separada por comas de MIME (`application/pdf`), comodines (`image/*`, `*/*`) o extensiones (`.xml`).               |
| `onError`                              | Recibe el `Error` de una seleccion fallida o rechazada; el mensaje tambien se muestra bajo el campo y lo marca invalido. |
| `multiple`                             | `false` por defecto.                                                                                                     |
| `placeholder`                          | `'Seleccionar archivo'` por defecto; se muestra mientras no hay archivos.                                                |
| `label`                                | Si es texto, nombra la zona pulsable; si no, la nombra `placeholder`.                                                    |
| `disabled`, `isDisabled`, `isReadOnly` | Bloquean el selector. `disabled` e `isDisabled` tambien deshabilitan el wrapper; `isReadOnly` se pasa como solo lectura. |
| `required`, `isRequired`               | Se combinan como obligatoriedad del wrapper.                                                                             |

En web `accept` se entrega tal cual al selector; en nativo solo se usa como
filtro del selector cuando todos sus elementos son MIME. En ambos casos, cada
archivo elegido se comprueba despues contra `accept` y un archivo que no
coincide rechaza toda la seleccion, sin llamar `onChange`.

Muestra los nombres de la ultima seleccion valida separados por comas, pero
no permite quitarlos; para listas editables usar
[FileUploader](datos-y-archivos.md#fileuploader). Mientras el selector esta
abierto la zona queda ocupada (`busy`) e ignora nuevas pulsaciones. No acepta
`value` ni `onChangeText`.

## FixedAutocomplete

Fuente: [FixedAutocomplete.tsx](../form/FixedAutocomplete.tsx). Importar
directamente; no es el [Autocomplete remoto](datos-y-archivos.md#autocomplete).
A diferencia de este, `Autocomplete` si reacciona a `value`: cambiarlo desde
fuera inicia una busqueda y abre el panel con texto no vacio, aunque el campo
no tenga el foco. Para limpiarlo tras seleccionar, asignar `''`.

| Prop                            | Valor por defecto / contrato                                     |
| ------------------------------- | ---------------------------------------------------------------- |
| `value`                         | `''`; inicializa estado local, no se sincroniza despues.         |
| `suggestions`                   | `[]`; objetos string `value`, `label` y `description?`.          |
| `onValueChange`                 | Escribir/limpiar: `(texto)`; seleccionar: `(value, suggestion)`. |
| `maxSuggestions`                | `5`; filtro local case-insensitive por label o value.            |
| `placeholder`                   | `'Type to search...'`.                                           |
| `label`, `disabled`, `required` | Se pasan a la composicion de formulario.                         |

Abre sugerencias al enfocar/escribir; admite flechas, Enter, Escape y
boton limpiar ("Limpiar"). Al seleccionar muestra `label` pero notifica
`value`. El `label` nombra el campo.
Con texto vacio muestra las primeras sugerencias.

Tiene dependencia de foco DOM (`contains`, `relatedTarget`) y posicionamiento
medido del portal. Mide al montar, no sigue de forma general scroll,
redimensionamiento o teclado; ademas registra dimensiones en consola.
No tratarlo como selector portable ni como un control ya integrado con errores
de `useValidator`.

## Switch

Fuente: [switch/index.tsx](../switch/index.tsx).

| Prop                                              | Contrato                                                                                        |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `value`                                           | Booleano controlado.                                                                            |
| `onChange`                                        | `() => void`, se conecta a `onToggle`; no promete entregar el siguiente booleano.               |
| `disabled`                                        | Se transforma en `isDisabled`.                                                                  |
| `size`                                            | `md` por defecto; `sm` 75 %, `lg` 125 %. `xl` se acepta pero no tiene estilo (se ve como `md`). |
| `trackColor`, `thumbColor`, `ios_backgroundColor` | Colores del `Switch` de React Native.                                                           |
| `containerClassName`                              | Clase adicional para `HStack` con `items-center w-full gap-2`.                                  |
| `label`, `labelPosition`                          | Muestra la etiqueta una vez a la izquierda (`left`, por defecto) o a la derecha (`right`).      |
| `accessibilityLabel`                              | Nombre accesible; sin el, el `label` nombra el switch.                                          |

Para un booleano de formulario con validacion y etiqueta, preferir `Checkbox`.
`bind(..., { type: 'checkbox' })` no se conecta directamente a esta API.
