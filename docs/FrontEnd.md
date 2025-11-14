# Documentación del FrontEnd - IntelliTasker

## Tabla de Contenidos

1. [Introducción](#introducción)

2. [Tecnologías Utilizadas](#tecnologías-utilizadas)

3. [Arquitectura](#arquitectura)

4. [Estructura de Carpetas](#estructura-de-carpetas)

5. [Componentes Principales](#componentes-principales)

6. [Contextos](#contextos)

7. [Utilidades](#utilidades)

8. [Tipos TypeScript](#tipos-typescript)

9. [Configuración](#configuración)

10. [Scripts Disponibles](#scripts-disponibles)

11. [Guía de Desarrollo](#guía-de-desarrollo)

---

## Introducción

El FrontEnd de IntelliTasker es una aplicación web desarrollada con React y TypeScript que permite gestionar tareas y proyectos de manera eficiente. La aplicación ofrece una interfaz intuitiva con soporte para modo claro y oscuro, múltiples vistas (lista y calendario), y funcionalidades avanzadas de filtrado y ordenamiento.

---

## Tecnologías Utilizadas

### Core

- **React 18.3.1**: Biblioteca para construir interfaces de usuario

- **TypeScript 5.5.3**: Superset de JavaScript con tipado estático

- **Vite 5.4.2**: Build tool y servidor de desarrollo rápido

### Estilos

- **Tailwind CSS 3.4.1**: Framework de CSS utility-first

- **PostCSS 8.4.35**: Procesador de CSS

- **Autoprefixer 10.4.18**: Plugin de PostCSS para agregar prefijos de navegadores

### Iconos y UI

- **Lucide React 0.344.0**: Biblioteca de iconos

### Base de Datos (Preparado para integración)

- **Supabase JS 2.57.4**: Cliente JavaScript para Supabase (preparado para uso futuro)

### Desarrollo

- **ESLint 9.9.1**: Linter para JavaScript/TypeScript

- **TypeScript ESLint 8.3.0**: Reglas de ESLint para TypeScript

---

## Arquitectura

La aplicación sigue una arquitectura de componentes basada en React con las siguientes características:

- **Componentes Funcionales**: Todos los componentes utilizan funciones de React con Hooks

- **Manejo de Estado Local**: Usando `useState` para estado del componente

- **Context API**: Para compartir el tema entre componentes

- **Props y Callbacks**: Para comunicación entre componentes padre e hijo

- **Memoización**: Uso de `useMemo` para optimizar cálculos costosos

### Flujo de Datos

```
App.tsx (Estado Principal)
  ├── ThemeContext (Estado Global del Tema)
  ├── Header
  │   └── Toggle de vista y tema
  ├── TaskFilter
  │   └── Filtrado y ordenamiento
  ├── TaskList / CalendarView
  │   └── TaskCard
  │       └── Subtareas
  └── TaskForm (Modal)
      └── Creación/Edición de tareas
```

---

## Estructura de Carpetas

```
FrontEnd/
├── src/
│   ├── components/          # Componentes React
│   │   ├── CalendarView.tsx # Vista de calendario mensual
│   │   ├── Header.tsx       # Header principal con navegación
│   │   ├── TaskCard.tsx     # Tarjeta individual de tarea
│   │   ├── TaskFilter.tsx   # Filtros y ordenamiento
│   │   ├── TaskForm.tsx     # Formulario de crear/editar tarea
│   │   └── TaskList.tsx     # Lista de tareas
│   │
│   ├── context/             # Contextos de React
│   │   └── ThemeContext.tsx # Contexto del tema (claro/oscuro)
│   │
│   ├── types/               # Definiciones de tipos TypeScript
│   │   └── task.ts          # Tipos para Task y Subtask
│   │
│   ├── utils/               # Funciones utilitarias
│   │   └── taskSort.ts      # Funciones de ordenamiento y filtrado
│   │
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada de la aplicación
│   ├── index.css            # Estilos globales y Tailwind
│   └── vite-env.d.ts        # Tipos de Vite
│
├── index.html               # HTML principal
├── package.json             # Dependencias y scripts
├── vite.config.ts           # Configuración de Vite
├── tailwind.config.js       # Configuración de Tailwind
├── tsconfig.json            # Configuración de TypeScript
├── tsconfig.app.json        # Config de TS para la app
├── tsconfig.node.json       # Config de TS para Node
└── eslint.config.js         # Configuración de ESLint
```

---

## Componentes Principales

### App.tsx

**Componente raíz de la aplicación**

**Responsabilidades:**

- Gestiona el estado global de las tareas

- Controla la vista activa (lista o calendario)

- Maneja los filtros, ordenamiento y búsqueda

- Coordina la apertura/cierre del formulario de tareas

**Estado Principal:**

```typescript
- tasks: Task[]           // Lista de todas las tareas
- isFormOpen: boolean     // Estado del modal de formulario
- editingTask: Task | null // Tarea en edición
- view: 'list' | 'calendar' // Vista activa
- sortBy: SortOption      // Opción de ordenamiento
- filterBy: FilterOption  // Opción de filtro
- searchQuery: string     // Texto de búsqueda
```

**Funciones Clave:**

- `handleCreateTask`: Crea una nueva tarea

- `handleUpdateTask`: Actualiza una tarea existente

- `handleDeleteTask`: Elimina una tarea

- `handleEditTask`: Abre el formulario en modo edición

---

### Header.tsx

**Componente del encabezado de la aplicación**

**Props:**

```typescript
interface HeaderProps {
  view: 'list' | 'calendar';
  onViewChange: (view: 'list' | 'calendar') => void;
  onCreateTask: () => void;
}
```

**Funcionalidades:**

- Muestra el título y subtítulo de la aplicación

- Toggle entre vista de lista y calendario

- Botón para cambiar tema (claro/oscuro)

- Botón para crear nueva tarea

---

### TaskList.tsx

**Componente que muestra la lista de tareas**

**Props:**

```typescript
interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (task: Task) => void;
}
```

**Funcionalidades:**

- Renderiza un grid de tarjetas de tareas

- Muestra mensaje cuando no hay tareas

- Responsive: 1 columna en móvil, 2 en tablet, 3 en desktop

---

### TaskCard.tsx

**Componente que representa una tarjeta individual de tarea**

**Props:**

```typescript
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (task: Task) => void;
}
```

**Funcionalidades:**

- Muestra información de la tarea (título, descripción, fechas, horas)

- Para tareas sin subtareas: botón para marcar como completada

- Para tareas con subtareas: muestra progreso y permite expandir/colapsar

- Botones para editar y eliminar

- Indicador visual de completado (texto tachado)

**Estado Local:**

- `showSubtasks: boolean` - Controla la visibilidad de subtareas

---

### TaskForm.tsx

**Componente modal para crear/editar tareas**

**Props:**

```typescript
interface TaskFormProps {
  task: Task | null;  // null = crear nueva, Task = editar existente
  onSave: (task: Task | Omit<Task, 'id'>) => void;
  onClose: () => void;
}
```

**Campos del Formulario:**

- Título (requerido)

- Descripción

- Fecha y hora de inicio (requerido)

- Fecha y hora de fin (requerido)

- Tiempo estimado total en horas (requerido)

- Subtareas (opcional):

  - Título de subtarea

  - Horas estimadas

**Funcionalidades:**

- Validación de campos requeridos

- Cálculo y visualización del total de horas de subtareas

- Agregar/eliminar subtareas dinámicamente

- Modo crear vs. modo editar

---

### TaskFilter.tsx

**Componente para filtrar, ordenar y buscar tareas**

**Props:**

```typescript
interface TaskFilterProps {
  tasks: Task[];
  sortBy: SortOption;
  filterBy: FilterOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}
```

**Funcionalidades:**

- **Búsqueda**: Por título o descripción

- **Ordenamiento**:

  - Más recientes primero

  - Más antiguas primero

  - Por fecha de vencimiento

  - Por título (A-Z)

  - Por progreso

  - Por duración (mayor)

- **Filtros**:

  - Todas las tareas

  - Para hoy

  - En progreso

  - Completadas

  - Vencidas

- **Estadísticas**: Muestra total, completadas, en progreso y vencidas

---

### CalendarView.tsx

**Componente de vista de calendario mensual**

**Props:**

```typescript
interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}
```

**Funcionalidades:**

- Vista mensual con navegación entre meses

- Muestra tareas que ocurren en cada día

- Diferencia visual entre tareas completadas y en progreso

- Resalta el día actual

- Click en tarea para editarla

- Leyenda de colores en la parte inferior

**Estado Local:**

- `currentDate: Date` - Mes actualmente visible

---

## Contextos

### ThemeContext.tsx

**Contexto para gestionar el tema (claro/oscuro)**

**Funcionalidades:**

- Almacena el tema actual ('light' | 'dark')

- Persiste la preferencia en localStorage

- Detecta preferencia del sistema operativo

- Aplica clase 'dark' al elemento raíz del documento

- Hook `useTheme()` para acceder al tema desde cualquier componente

**API:**

```typescript
const { theme, toggleTheme } = useTheme();
// theme: 'light' | 'dark'
// toggleTheme: () => void
```

---

## Utilidades

### taskSort.ts

**Utilidades para ordenar y filtrar tareas**

#### Funciones Exportadas:

**`sortTasks(tasks: Task[], sortBy: SortOption): Task[]`**

- Ordena un array de tareas según la opción especificada

- Opciones disponibles: 'recent', 'oldest', 'dueDate', 'title', 'progress', 'duration'

**`filterTasks(tasks: Task[], filterBy: FilterOption): Task[]`**

- Filtra tareas según el criterio especificado

- Opciones disponibles: 'all', 'completed', 'inProgress', 'overdue', 'today'

- Lógica inteligente:

  - Tareas sin subtareas: usa campo `completed`

  - Tareas con subtareas: verifica si todas las subtareas están completadas

**`getTaskStats(tasks: Task[]): { total, completed, inProgress, overdue }`**

- Calcula estadísticas de un conjunto de tareas

- Retorna contadores para cada categoría

---

## Tipos TypeScript

### task.ts

```typescript
export interface Subtask {
  id: string;
  title: string;
  estimatedHours: number;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  startDateTime: string;      // ISO 8601 format
  endDateTime: string;         // ISO 8601 format
  estimatedHours: number;
  completed: boolean;          // Solo para tareas sin subtareas
  subtasks: Subtask[];
}
```

**Notas importantes:**

- Las fechas se almacenan como strings en formato ISO 8601

- El campo `completed` en Task se usa solo para tareas sin subtareas

- Para tareas con subtareas, el estado de completado se calcula dinámicamente

---

## Configuración

### Vite (vite.config.ts)

```typescript
{
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react']  // Excluido para optimización
  }
}
```

### Tailwind (tailwind.config.js)

```javascript
{
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### TypeScript

- **tsconfig.app.json**: Configuración para código de la aplicación

- **tsconfig.node.json**: Configuración para scripts de Node (Vite)

- **tsconfig.json**: Proyecto de referencias para ambos

**Características habilitadas:**

- Strict mode activado

- ES2020 target

- JSX: react-jsx

- Module resolution: bundler

### ESLint

- Configuración estricta con TypeScript ESLint

- Reglas para React Hooks

- Reglas para React Refresh

---

## Scripts Disponibles

### Desarrollo

```bash
npm run dev
# o
pnpm dev
```

Inicia el servidor de desarrollo con Vite en modo hot-reload.

### Build de Producción

```bash
npm run build
# o
pnpm build
```

Genera los archivos optimizados para producción en la carpeta `dist/`.

### Preview de Producción

```bash
npm run preview
# o
pnpm preview
```

Sirve los archivos de producción localmente para pruebas.

### Linting

```bash
npm run lint
# o
pnpm lint
```

Ejecuta ESLint para verificar errores de código.

### Type Checking

```bash
npm run typecheck
# o
pnpm typecheck
```

Verifica tipos TypeScript sin generar archivos.

---

## Guía de Desarrollo

### Agregar un Nuevo Componente

1. Crear archivo en `src/components/NombreComponente.tsx`:

```typescript
import { useTheme } from '../context/ThemeContext';

interface NombreComponenteProps {
  // Props aquí
}

function NombreComponente({ }: NombreComponenteProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={isDark ? 'bg-slate-800' : 'bg-white'}>
      {/* Contenido */}
    </div>
  );
}

export default NombreComponente;
```

1. Importar y usar en el componente padre.

### Agregar una Nueva Utilidad

1. Crear archivo en `src/utils/nombreUtilidad.ts`

2. Exportar funciones con tipos TypeScript apropiados

3. Importar donde se necesite

### Manejo de Temas

Para soportar modo oscuro en un componente:

```typescript
import { useTheme } from '../context/ThemeContext';

const { theme } = useTheme();
const isDark = theme === 'dark';

// Usar en className
className={`${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}
```

### Formateo de Fechas

Las fechas se almacenan como strings ISO 8601. Para formatearlas:

```typescript
const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
```

### Estilos CSS Personalizados

Agregar estilos en `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Tus estilos personalizados aquí */
.mi-clase-personalizada {
  /* ... */
}
```

---

## Sistema de Diseño

### Paleta de Colores

**Modo Claro:**

- Fondo principal: `slate-50` a `slate-100` (gradiente)

- Tarjetas: `white`

- Texto principal: `slate-900`

- Texto secundario: `slate-600`

- Bordes: `slate-200` a `slate-300`

**Modo Oscuro:**

- Fondo principal: `slate-950`

- Tarjetas: `slate-800`

- Texto principal: `white`

- Texto secundario: `slate-400`

- Bordes: `slate-700`

**Colores de Estado:**

- Completado: `green-600`

- En progreso: `blue-600`

- Vencido: `red-600`

- Acción primaria: `blue-600`

### Tipografía

- Fuente del sistema (sans-serif por defecto)

- Tamaños: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`

- Pesos: `font-medium`, `font-semibold`, `font-bold`

### Espaciado

- Usa el sistema de espaciado de Tailwind (0.25rem, 0.5rem, 1rem, etc.)

- Padding común: `p-4`, `p-5`, `p-6`

- Gap común: `gap-3`, `gap-4`, `gap-6`

---

## Dependencias Principales

### Producción

- `react` / `react-dom`: Framework UI

- `lucide-react`: Iconos

- `@supabase/supabase-js`: Cliente Supabase (preparado para uso futuro)

### Desarrollo

- `vite`: Build tool

- `@vitejs/plugin-react`: Plugin React para Vite

- `typescript`: Tipado estático

- `tailwindcss`: Estilos

- `eslint`: Linting

- `autoprefixer` / `postcss`: Procesamiento CSS

---

## Funcionalidades Futuras

### Preparadas para Implementación

- Integración con Supabase (cliente ya instalado)

- Persistencia de datos en base de datos

- Autenticación de usuarios

- Sincronización en tiempo real

### Mejoras Sugeridas

- Arrastrar y soltar para reorganizar tareas

- Notificaciones de tareas vencidas

- Exportar/importar tareas (JSON, CSV)

- Compartir tareas con otros usuarios

- Vista de semana en el calendario

- Búsqueda avanzada con múltiples criterios

- Etiquetas/categorías para tareas

- Modo de vista compacta

---

## Notas Importantes

1. **Persistencia**: Actualmente las tareas se almacenan solo en memoria. Se perderán al recargar la página.

2. **IDs de Tareas**: Se generan usando `Date.now().toString()`. Para producción, considerar usar UUIDs.

3. **Fechas**: Se usan strings ISO 8601. Asegurarse de que los inputs `datetime-local` proporcionen este formato.

4. **Modo Oscuro**: El tema se persiste en `localStorage` con la clave `'theme'`.

5. **Responsive**: La aplicación está optimizada para móvil, tablet y desktop usando Tailwind's responsive breakpoints.

---

## Troubleshooting

### Los estilos no se aplican

- Verificar que Tailwind esté configurado correctamente

- Revisar que las clases estén incluidas en `tailwind.config.js` content

### El tema oscuro no funciona

- Verificar que `ThemeContext` esté envolviendo la app en `main.tsx`

- Revisar que `document.documentElement.classList` tenga la clase 'dark'

### Los tipos TypeScript dan error

- Ejecutar `npm run typecheck` para ver errores detallados

- Verificar que los tipos estén correctamente importados

---

## Recursos Adicionales

- [Documentación de React](https://react.dev/)

- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)

- [Documentación de Vite](https://vitejs.dev/)

- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)

- [Lucide Icons](https://lucide.dev/)

---

**Última actualización**: 2025
**Versión**: 0.0.1 (Desarrollo)