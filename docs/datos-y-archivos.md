# Datos, edicion y archivos

[Indice general](../README.md) / [Formularios](formularios.md)

## DataTable

Fuente: [datatable/index.tsx](../datatable/index.tsx).
Exports: `DataTable`, tipos `Column<T>`, `PaginationChange`,
`DataTableProps<T>`, `SimplePaginationLinksProps`, `DynamicProps`,
`RowKey`, `RowSelection<T>` y `SelectionChange<T>`.

La tabla recibe datos ya preparados; no consulta, filtra, ordena ni pagina
en memoria. Usa un ScrollView y representa todas las filas recibidas,
con cabecera sticky web y una fila espaciadora tras cada fila de datos.

| Prop                 | Contrato                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `columns`            | `Column<T>[]`, obligatoria.                                                                                                                       |
| `data`               | `T[]`, obligatoria. Pasar `[]` durante la inicializacion, no `undefined`.                                                                         |
| `className`          | Clase de la tabla, no del ScrollView.                                                                                                             |
| `stripped`           | Booleano; este es el nombre implementado, no `striped`. Aplica fondo a las filas de indice par (0, 2, ...).                                       |
| `hoverable`          | `true` por defecto; agrega fondo hover.                                                                                                           |
| `onRow(item, index)` | Devuelve props dinamicas para la fila. Con `onPress` u `onClick` agrega `cursor-pointer`.                                                         |
| `rowKey`             | Nombre del campo de clave o `(item: T) => string \| number`; obligatorio con `rowSelection`. Sin seleccion es opcional y usa indices si se omite. |
| `rowSelection`       | Seleccion controlada con `selectedRowKeys` y `onChange({ selectedRowKeys, selectedRows })`. Agrega checkboxes de cabecera y filas.                |
| `empty`              | ReactNode para vacio de primera pagina. No hay vacio automatico.                                                                                  |
| `pagination`         | Objeto de paginacion simple; no recorta `data`: el consumidor carga cada pagina.                                                                  |

### Columnas

```ts
import type { ReactNode } from 'react';

type Column<T> = {
  name: string;
  dataKey: string;
  visible?: boolean;
  cell?: (value: any, item: T) => ReactNode | string;
  header?: (column: Column<T>) => ReactNode;
  onCell?: (item: T) => { [key: string]: unknown };
  onHeader?: () => { [key: string]: unknown };
};
```

Es la forma del contrato actual; importar el tipo existente, no recrearlo.
Los renderers aceptan contenido React. Definir tipos locales del dominio
para `T`; el `any` del contrato compartido no es motivo para perder el
tipo de `item` en consumidores.

- `visible !== false` incluye la columna.
- `dataKey` se lee con `item[dataKey]`, sin resolver rutas anidadas.
- `cell(value, item)` personaliza el contenido y reemplaza por completo el
  valor original: si devuelve `null` o `undefined` la celda queda vacia,
  sin volver a `item[dataKey]`.
- `header(column)` personaliza encabezado; un retorno nullish vuelve a
  `name`. En nativo activa `useRNView` en la celda de encabezado.
- `onCell` y `onHeader` sirven para props/clases, por ejemplo ancho
  y alineacion. La `className` de `onHeader` se combina con la base
  (si falta o no es string no agrega clases);
  las props de `onCell` se esparcen despues de la clase base, por lo que su
  `className` la reemplaza. Mantener `dataKey` unico entre columnas.
- En nativo las celdas parten de `w-32`; si `onCell` devuelve `className`,
  ese ancho deja de aplicarse. Cada celda es un `Text`, salvo la que contiene
  el checkbox de seleccion: el contenido de `cell` queda dentro de ese texto.
  Comprobar anchos y scroll horizontal.

En [web](../../z/table/index.web.tsx) la base representa table/tr/td DOM:
las props de `onRow` se reenvian sin traducir eventos. Para interaccion
de fila, no asumir que `onPress` se convierte en `onClick`; revisar la
API de la plataforma, tambien al representar JSX dentro de las celdas.

```tsx
import { DataTable, type Column } from '@/components/ui/datatable';
import { Text } from '@/components/ui/text';

type RowData = { id: string; nombre: string; total: number };

const columns: Column<RowData>[] = [
  { name: 'Nombre', dataKey: 'nombre' },
  {
    name: 'Total',
    dataKey: 'total',
    onHeader: () => ({ className: 'text-right' }),
    onCell: () => ({ className: 'text-right' }),
    cell: (_value, item) => <Text>{item.total.toFixed(2)}</Text>,
  },
];

<DataTable
  columns={columns}
  data={rows}
/>;
```

`rows` es un arreglo tipado del consumidor; el formato monetario del ejemplo
es ilustrativo, no reemplaza reglas de moneda/redondeo del dominio.

### Paginacion

```tsx
<DataTable
  columns={columns}
  data={rows}
  pagination={{
    count: rows.length,
    currentPage: page,
    perPage: 20,
    onPaginationChange,
  }}
/>
```

`onPaginationChange` recibe
`{ page, perPage }`. `PaginationChange` tambien declara `sortBy?` y
`sortDirection?: 'ASC' | 'DESC'`, pero los botones de esta tabla no
producen ordenamiento.

| Campo         | Semantica real                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| `count`       | Cantidad de filas de la pagina, no total global.                                                            |
| `currentPage` | Base uno.                                                                                                   |
| `perPage`     | Tamano de pagina usado para decidir siguiente y el texto.                                                   |
| Anterior      | Habilitado cuando pagina > 1.                                                                               |
| Siguiente     | Habilitado con count > 0 y count >= perPage. Puede ofrecer una pagina vacia si el total es multiplo exacto. |

La etiqueta muestra `inicio-fin de currentPage * perPage`; ese ultimo
numero **no es el total real del servidor**. No anunciar un conteo global
basandose en ella. El callback debe disparar la carga/sincronizacion externa.

El estado vacio solo se muestra si `currentPage === 1 && data.length === 0`;
en ese caso tampoco se muestran los enlaces de paginacion.
En paginas posteriores vacias no representa `empty` y conserva los enlaces.
Carga/error se componen fuera, por ejemplo con `Loading` y error persistente.

### Seleccion de filas

```tsx
import { useState } from 'react';

import { DataTable, type SelectionChange } from '@/components/ui/datatable';

const [selection, setSelection] = useState<SelectionChange<RowData>>({
  selectedRowKeys: [],
  selectedRows: [],
});

const { selectedRowKeys } = selection;

<DataTable
  columns={columns}
  data={rows}
  rowKey="id"
  rowSelection={{ selectedRowKeys, onChange: setSelection }}
/>;
```

`RowData`, `columns` y `rows` corresponden al ejemplo anterior. El consumidor
actualiza el estado en `onChange`; la tabla no mantiene seleccion interna.
`rowSelection.disabled` bloquea ambos tipos de checkbox y sus callbacks,
por ejemplo mientras se carga otra pagina.
Las claves deben ser unicas, estables y de tipo string o number. Un campo
inexistente o una clave de otro tipo produce un error explicito.

La cabecera selecciona todas las filas de `data`, no todas las paginas del
servidor; reemplaza las claves anteriores. Desmarcarla limpia la seleccion.
El estado parcial/total considera solo las claves presentes en `data`, no
el total de claves externas, y el checkbox queda deshabilitado sin filas.
Marcar una fila no duplica claves; desmarcarla elimina solo su clave.
Como en la tabla original, los cambios individuales conservan claves de
otras paginas, pero `selectedRows` contiene solo objetos del `data` actual.
Para operaciones sobre varias paginas, resolver esas claves en el consumidor.
La seleccion no dispara los eventos de click de la fila en web.
`ListLayout` reenvia `rowKey` y `rowSelection` con el mismo contrato; no
agrega seleccion si el consumidor no la configura.

`rowKey="id"` ahora usa `item.id` como key de React; el extractor funcional
permite claves calculadas. Sin `rowKey` se conservan los indices y sus
limitaciones ante reordenamientos.

Referencias: [ListLayout](../../../core/layout/ListLayout.tsx) compone
busqueda/acciones/carga, pero no representa su error ni un empty propio;
[ListExpensesPage](../../../apps/gastify/expenses/ListExpensesPage.tsx)
muestra columnas con renderers, ancho, avatar, tooltip y menu.

## Autocomplete

Fuente: [Autocomplete.tsx](../autocomplete/Autocomplete.tsx).
Importacion: `Autocomplete` desde `@/components/ui/autocomplete`.
Los tipos `AutocompleteInputProps<Item>`, su alias `AutocompleteProps<Item>`
y `AutocompleteSearchResult<Item>` se exportan tambien desde el barrel.

No confundir con `form/FixedAutocomplete`: este hace **busqueda asincrona**.

| Prop                                                          | Contrato                                                                                                                                                        |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onSearch(keyword, page)`                                     | Obligatoria; pagina desde 1. Devuelve `Promise<Item[]>` sin paginacion o `Promise<{ data: Item[]; hasMore: boolean }>` para carga incremental.                  |
| `onSelect(item)`                                              | Obligatoria, recibe el objeto seleccionado.                                                                                                                     |
| `renderItem`                                                  | Renderer de fila FlatList; el wrapper lo coloca dentro de Pressable.                                                                                            |
| `keyExtractor`                                                | Extractor de clave; por defecto usa indice (`key-${index}`).                                                                                                    |
| `renderResultList`                                            | Componente que recibe props de FlatList; debe reenviar el ref para desplazar la opcion activa con teclado.                                                      |
| `renderTextInput`                                             | Recibe props enlazadas: texto, handlers internos de cambio/foco/teclado y ref. Debe reenviarlas al input.                                                       |
| `hideResults`                                                 | Oculta la lista sin cancelar la busqueda.                                                                                                                       |
| `searchOnEmpty`                                               | Default `false`. Al activarlo, consulta tambien el texto vacio para mostrar la primera pagina sin escribir, solo con el input enfocado.                         |
| `containerStyle`, `inputContainerStyle`, `listContainerStyle` | Estilos del contenedor, contenedor de input y panel de resultados.                                                                                              |
| `style`                                                       | Se agrega al estilo del input por defecto.                                                                                                                      |
| `value`, `defaultValue`, `onChangeText`                       | Texto controlado o interno y notificacion de cambios. El consumidor controlado debe actualizar `value`.                                                         |
| `keyboardShouldPersistTaps`                                   | Se transmite a la FlatList; default `handled` para seleccionar con el teclado movil abierto.                                                                    |
| `onEndReached`, `onEndReachedThreshold`                       | Carga la pagina siguiente y notifica el evento; umbral por defecto `0.2`.                                                                                       |
| `listProps`                                                   | Props adicionales de FlatList (estilos, cabeceras, separadores, etc.). El componente conserva data, renderItem, ref y handlers necesarios para paginar/navegar. |
| `onShowResults`                                               | Notifica la visibilidad del panel, tambien durante carga, vacio y error.                                                                                        |
| `onStartShouldSetResponderCapture`                            | Se asigna al contenedor de resultados; default retorna false.                                                                                                   |

Por compatibilidad, el tipo mezcla props de `TextInput` y parte de `FlatList`.
Para props adicionales de la lista usar `listProps`: no todas las props
heredadas de FlatList se reenvian desde el nivel superior.

```tsx
import { Autocomplete } from '@/components/ui/autocomplete';
import { Text } from '@/components/ui/text';

type Option = { id: string; nombre: string };

<Autocomplete<Option>
  placeholder="Buscar por nombre"
  onSearch={searchOptions}
  onSelect={selectOption}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Text>{item.nombre}</Text>}
/>;
```

Para una busqueda sin paginacion se conserva
`searchOptions: (keyword: string) => Promise<Option[]>`. Para paginar, adaptar
la respuesta del servicio a este contrato:

```tsx
import type { AutocompleteSearchResult } from '@/components/ui/autocomplete';

async function searchOptions(
  keyword: string,
  page: number,
): Promise<AutocompleteSearchResult<Option>> {
  const { data, currentPage, lastPage } = await loadOptions(keyword, page);

  return { data, hasMore: currentPage < lastPage };
}
```

`loadOptions` representa la consulta del consumidor; el componente no conoce
endpoints ni metadatos de un backend concreto. No borrar errores devolviendo
listas vacias para aparentar exito.

### Estado y limites

- Cada texto no vacio dispara la primera pagina; al cambiarlo o vaciarlo
  descarta los resultados previos. Con `searchOnEmpty`, tambien consulta el
  texto vacio al enfocar o limpiar con el input enfocado; nunca abre al montar,
  para que varios autocompletados no cubran a sus vecinos. Respeta
  `value`/`defaultValue`.
- Perder el foco cierra los resultados, salvo que pase a una opcion del panel
  (web) o que la ventana completa pierda el foco. `onFocus`/`onBlur` del
  consumidor se siguen llamando.
- Recuperar el foco reutiliza las paginas cargadas de la misma consulta, incluso
  si quedaron vacias, sin volver a solicitarlas. Conserva la pagina alcanzada
  para continuar al desplazar. Cambiar el texto o remontar reinicia los datos;
  no se conserva un historial de consultas.
- Llegar al final agrega la siguiente pagina sin reemplazar las anteriores.
  Serializa solicitudes de la misma busqueda; se detiene con `hasMore=false`,
  una pagina vacia o una respuesta de tipo arreglo.
- Ignora respuestas obsoletas al cambiar texto, cerrar, seleccionar o desmontar.
  No aborta la peticion de red ni aplica debounce/minimo de caracteres.
- Muestra carga, vacio y error. Un fallo conserva las paginas cargadas y ofrece
  **Reintentar** para la misma pagina; no continua paginando automaticamente
  mientras haya un error.
- Flechas arriba/abajo resaltan y desplazan la opcion activa sin circular;
  arriba desde ninguna opcion activa empieza por la ultima. Abajo al alcanzar
  el ultimo resultado solicita otra pagina si existe. Enter selecciona;
  Escape cierra e invalida solicitudes pendientes. No intercepta teclas con
  `hideResults` ni cuando `onKeyPress` cancela el evento.
- Clic/tap y Enter ejecutan el mismo `onSelect` y cierran los resultados;
  no reemplazan/limpian automaticamente el texto ni persisten la seleccion.
  Los datos cargados siguen disponibles al volver a enfocar; si la consulta
  no tiene ninguna pagina resuelta, inicia otra busqueda del texto actual.
- Por defecto representa `String(item)` si no hay renderer; para objetos
  de dominio definir `renderItem`.
- El input por defecto reutiliza `Input`. La FlatList posee el scroll;
  el panel es absoluto bajo el input y tiene una altura maxima de 450.
  Verificar clipping y stacking en la pantalla contenedora.
- En web cada `View` crea un contexto de apilamiento (`z-index: 0`), por lo
  que las tarjetas posteriores pueden tapar el panel. No cambiar
  `listContainerStyle` a `position: 'relative'`: desplaza el contenido.
  Elevar el `zIndex` de los ancestros mientras `onShowResults` sea `true`,
  como hacen `PartyCatalogSearch` y `PartyPicker` en Facturami.

Pruebas enfocadas:
`npm test -- --selectProjects native --runInBand --runTestsByPath components/ui/autocomplete/Autocomplete.test.tsx`.

Para un catalogo fijo, usar `Select`; para sugerencias locales, revisar
[FixedAutocomplete](formularios.md#fixedautocomplete) con sus limites DOM.
Los permisos y la paginacion de un selector de dominio no desaparecen al
reemplazar su apariencia.

## Editable

Fuente: [Editable.tsx](../editable/Editable.tsx).

| Prop              | Contrato                                                         |
| ----------------- | ---------------------------------------------------------------- |
| `label`           | ReactNode obligatorio; es lo que se muestra fuera de edicion.    |
| `value`           | String o numero opcional, convertido a texto inicial.            |
| `onSave(value)`   | Obligatorio; recibe string.                                      |
| `required`        | `false`; valida texto no vacio usando trim.                      |
| `validate(value)` | Retorna mensaje string o void; con error bloquea Guardar.        |
| `type`            | `'text'` por defecto, usado por FormControl.                     |
| `placeholder`     | `'Escribe un valor...'` por defecto; al campo solo si es string. |

Muestra `label || placeholder` junto al lapiz; no representa automaticamente
`value` como etiqueta. Al pulsar el boton entra a edicion con un campo
nombrado por `label` y los botones "Guardar" y "Cancelar". Enter guarda si no hay error; Escape cancela.
La validacion requerida muestra `'Este campo es obligatorio'`.

La validacion corre al entrar a edicion, al cambiar el texto y de nuevo al
guardar: con `required` y valor inicial vacio el error aparece al abrir el
campo y Guardar/Enter no envian un texto invalido aunque no se haya escrito nada.

Limites de la implementacion:

- Inicializa texto desde `value` una vez; no resincroniza cambios posteriores
  de prop automaticamente. Cambiar la identidad del editor cuando corresponda.
- `onSave` cierra edicion inmediatamente; el componente no muestra error
  remoto ni maneja `busy`.
- Cancelar vuelve al `value` recibido (texto vacio si es undefined).

Usarlo para una edicion puntual con validacion/persistencia controladas por
el consumidor. Para formularios de negocio completos, usar `useValidator`
y `FormLayout`.

## QuantityStepper

Fuente: [QuantityStepper.tsx](../quantity-stepper/QuantityStepper.tsx).

| Prop              | Contrato                          |
| ----------------- | --------------------------------- |
| `value`           | Numero del consumidor.            |
| `onChange(value)` | Callback numerico obligatorio.    |
| `rounded`         | `true`; botones circulares.       |
| `size`            | `xs` o `sm`, opcional; ver abajo. |
| `buttonClassName` | Clases de ambos botones.          |

Muestra `value`; solo mientras se escribe conserva un texto local.
Los botones "Aumentar cantidad" y "Disminuir cantidad" calculan
`value + 1` o `value - 1` sobre el valor externo; el campo se llama
"Cantidad";
el consumidor debe devolver el nuevo valor.
El texto escrito se guarda localmente y se interpreta con `parseFloat`
al confirmar/perder foco. Si no es numerico vuelve al original sin llamar
a `onChange`. El campo vacio se marca invalido, sin mensaje de error.

`size` se pasa a ambos botones; con `sm` el campo mide `w-16` y en otro
caso `w-24`.

Despues de cada cambio (botones, confirmar o perder foco) el campo vuelve a
mostrar `value`, aunque no cambie. Si el consumidor ajusta el numero emitido
(por ejemplo, `Math.max(1, value)` cuando se emite `0`), el campo muestra el
valor ajustado; si no actualiza `value`, conserva el anterior.

No tiene min, max, step personalizado, precision, bloqueo ni restricciones
de inventario. Acepta negativos y decimales; `parseFloat` puede aceptar
prefijos numericos de textos que no son cantidades validas de negocio.
`onEndEditing` extrae `event.nativeEvent.text` y lo pasa al mismo
normalizador numerico que usa el resto de acciones.

No usar sus resultados directamente para cambiar importes, stock o reglas
de credito sin validacion del dominio.

## Base64FileInput

Fuente: [Base64FileInput.tsx](../base64-file-input/Base64FileInput.tsx).
Usa `expo-document-picker` y `expo-file-system`; funciona en web, iOS y
Android. No requiere `type="file"` ni expone un evento DOM.

| Prop                                | Default / contrato                                                                                                                                        |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                              | Opcional; se incluye en el objeto emitido.                                                                                                                |
| `accept`                            | Extension (`.cer`) o MIME (`application/pdf`); las extensiones se validan despues de elegir en nativo.                                                    |
| `multiple`                          | `false`; con `true`, `onChange` recibe un arreglo.                                                                                                        |
| `label`, `help`, `children`, `icon` | Contenido visual del selector.                                                                                                                            |
| `value`                             | `{ filename }` para mostrar el nombre seleccionado y el boton "Eliminar archivo <filename>", que limpia sin abrir el selector.                            |
| `showFileName`                      | `true`; controla la presentacion del nombre.                                                                                                              |
| `onChange(value)`                   | Entrega `{ name?, filename, value: { size, type, name, content } }`; limpiar envia `null` o `[]` si `multiple`. `content` es Base64 sin prefijo Data URL. |
| `onError(error)`                    | Opcional; recibe errores al elegir, validar o leer el archivo.                                                                                            |

Web usa el Base64 del selector y nativo lee la URI mediante FileSystem.
El componente no sube ni persiste archivos. Mantener el contenido fuera de
logs, almacenamiento y estado global salvo que el flujo lo requiera.

## FileUploader

Fuente: [file-uploader/index.tsx](../file-uploader/index.tsx).
**Solo web:** representa un `<input>` DOM y trabaja con `HTMLInputElement`,
`FileList` y `File`. En Android e iOS no funciona y falla al representarse;
para nativo usar [`Input type="file"`](#archivos-con-input-typefile) o
`Base64FileInput`. No realiza una subida HTTP a pesar del nombre.

| Prop                     | Default / contrato                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| `files`                  | `UploadFileCollection`: `FileList` o arreglo readonly de `File`; representa la seleccion controlada. |
| `onChange(files)`        | Recibe `File[]` con la seleccion combinada con archivos existentes.                                  |
| `onDelete(index, file?)` | Opcional; si existe, el consumidor actualiza `files`.                                                |
| `showSelectedFilesList`  | `true`; muestra `UploadFileList`.                                                                    |
| `hideOnSelectFiles`      | `false`; tiene una discrepancia de render descrita abajo.                                            |
| `label`                  | `'Haz click para subir archivos'`.                                                                   |
| `containerClassName`     | Clases combinadas con `p-4 gap-4`.                                                                   |
| Resto de props           | Se pasan al input oculto; por ejemplo `multiple` y `accept`.                                         |

Al seleccionar concatena existentes y nuevos, llama a `onChange` y limpia
el valor del input para permitir reseleccionar el mismo archivo. No deduplica,
valida extension/tamano ni hace multipart.
Sin `onDelete`, filtra por indice y llama a `onChange`.

### Limitaciones de archivos

1. Al agregar/eliminar emite un arreglo `File[]`, no un `FileList` DOM.
   Para leer cualquiera de las colecciones admitidas usar `Array.from(files)`;
   no asumir `.item()` sobre el resultado de `onChange`.
2. La expresion de render es
   `!hideOnSelectFiles || (hideOnSelectFiles && files.length === 0 && JSX)`.
   Con el default `false` el resultado es boolean `true`, no el selector:
   la zona para seleccionar **no aparece**.
   Con `true` aparece solo si no hay archivos y se oculta al seleccionar.
   No documentar el default como una zona de subida siempre visible.
3. La seleccion inicial puede ser `[]`; no usar
   `[] as FileList` ni casts dobles.
   Si se necesita un selector simple sin este contrato, usar
   [`Input type="file"`](#archivos-con-input-typefile).
4. `accept` ayuda al selector, no sustituye validacion del cliente/servidor.
   El contenido de un archivo no debe enviarse a logs.

## Archivos con Input type="file"

Fuente: [FileInput.tsx](../form/FileInput.tsx). `Input type="file"` delega
en `FileInput`, que usa `expo-document-picker` en web, iOS y Android; no
representa un `<input type="file">` DOM ni entrega `File`/`FileList`.
Tipos: `FileInputProps` y `FileInputAsset` desde `@/components/ui/form`.

`onChange(files)` recibe `FileInputAsset[]` (`uri`, `name`, `mimeType`,
`size`; en web tambien `file`) y no se llama si se cancela el selector.
`accept` admite extensiones y MIME separados por comas; la seleccion se
valida despues de elegir y un rechazo se muestra como error y llega a
`onError`. `multiple` es `false` por defecto. No acepta `value` ni
`onChangeText`, recuerda los nombres elegidos pero no permite quitarlos.

```tsx
import { useState } from 'react';

import { Input, type FileInputAsset } from '@/components/ui/form';

const [files, setFiles] = useState<FileInputAsset[]>([]);

<Input
  type="file"
  label="Comprobante"
  accept=".pdf,image/*"
  onChange={setFiles}
/>;
```

## UploadFileList

Fuente: [UploadFileList.tsx](../file-uploader/UploadFileList.tsx).
Importar directamente: **no** se exporta desde `file-uploader/index.tsx`.

| Prop                               | Contrato                                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| `files`                            | `UploadFileCollection` (`FileList` o arreglo readonly), recorrido mediante `Array.from`. |
| `allowDelete`                      | `true` por defecto.                                                                      |
| `onRenderAttributes(file, index?)` | ReactNode adicional en los atributos. El runtime solo pasa `file`.                       |
| `onRenderActions(file, index?)`    | ReactNode adicional para acciones. El runtime pasa file e index.                         |
| `onDelete(index, file?)`           | Obligatorio; recibe primero indice y despues archivo.                                    |

Representa nombre truncado, extension en badge, tamano con `formatBytes`,
boton eliminar opcional y acciones personalizadas, dentro de ScrollView.
Usa `file.name` como key: archivos con igual nombre producen keys repetidas.

**Orden de argumentos de borrado:** `onDelete(index, file)` coincide
con `FileUploader.onDelete` y con el tipo publico `UploadFileListProps`.
No conectar un callback esperando el archivo como primer argumento.
`allowDelete=false` permite una lista de solo lectura, pero el tipo sigue
exigiendo `onDelete`.

## Flujo recomendado de adjuntos

1. Usar `Base64FileInput` cuando se necesite el contenido Base64 en web y
   nativo, e `Input type="file"` cuando basten los `FileInputAsset` del
   selector en cualquier plataforma. `FileUploader` depende de `File` y del
   DOM: es solo web y no debe usarse en flujos nativos.
2. Mantener archivos locales fuera de DTOs JSON y de persistencia del store
   salvo que el contrato tenga una estrategia explicita para ellos.
3. Validar cantidad, tipo y tamano sin considerar `accept` una validacion.
4. Construir `FormData` en la capa de guardado respetando el endpoint y los
   nombres de campos de la aplicacion.
5. Presentar carga/error, impedir doble envio y limpiar seleccion solo cuando
   corresponda al resultado o cancelacion.

Referencia de integracion web:
[UploadCuentasPorCobrar](../../../apps/finanzas/cuentas-por-cobrar/containers/UploadCuentasPorCobrar.tsx).
Sus campos de multipart son especificos del dominio, no una API universal
de estos componentes.
