
## 🎯 **Objetivo del proyecto**

Desarrollar una PWA que permita:

- Crear tareas principales con fechas, horas y tiempos estimados.

- Desglosar tareas en subtareas con tiempos estimados individuales.

- Organizar tareas en un calendario o sistema de planificación diaria.

- Funcionar offline (característica de PWA manejada con Vite).

- Ser intuitiva y eficiente para el usuario.

---

## 🛠️ **Tecnologías recomendadas**

- **Frontend:** React-TS

- **UI Framework:** Tailwind CSS

- **Backend (opcional al inicio):** Python

- **Base de datos:** IndexedDB (cliente) o MongoDB

- **Service Worker:** Para funcionalidad offline

- **Calendario UI:** Librería como FullCalendar o React Big Calendar

- **PWA:** Manifest.json + Service Worker

## 🧱 **Funcionalidades principales**

1. **Login / Registro (opcional al inicio)**

   - Opcional: puedes comenzar con una app sin login (datos en local storage o IndexedDB)

2. **Dashboard de tareas**

   - Vista general de tareas pendientes, en progreso y completadas

   - Estadísticas de tiempo estimado vs real (futuro)

3. **Crear/editar tareas**

   - Formulario con:

     - Nombre, descripción

     - Fecha/hora de inicio y fin

     - Tiempo estimado total

     - Subtareas con tiempos estimados

4. **Vista de calendario**

   - Visualizar tareas por día/hora

   - Arrastrar y soltar para reorganizar

5. **Gestión de subtareas**

   - Agregar/editar subtareas

   - Marcar como completadas

   - Ver tiempo acumulado de subtareas

6. **PWA features**

   - Instalable en escritorio/móvil

   - Funcionalidad offline

   - Notificaciones (opcional)

---

## 🧭 **Plan de acción por fases**

### ✅ **Fase 1: Configuración del proyecto (1 semana)**

- Configurar entorno de desarrollo

- Crear estructura de proyecto con React + Vite o Create React App

- Configurar Tailwind o Material UI

- Configurar PWA (manifest.json, service worker)

### ✅ **Fase 2: Diseño de UI/UX (1 semana)**

- Prototipar pantallas clave: dashboard, crear tarea, vista calendario

- Implementar componentes básicos

### ✅ **Fase 3: Almacenamiento local (1 semana)**

- Configurar IndexedDB o localStorage para guardar tareas

- Crear CRUD básico de tareas y subtareas

### ✅ **Fase 4: Lógica de tareas y subtareas (1 semana)**

- Crear formularios para tareas/subtareas

- Validar tiempos estimados

- Mostrar resumen de tiempos

### ✅ **Fase 5: Vista de calendario y organización (1 semana)**

- Integrar una librería de calendario

- Mostrar tareas en días/horas

- Permitir reorganización de tareas

### ✅ **Fase 6: Mejoras y PWA offline (1 semana)**

- Añadir funcionalidad offline

- Añadir notificaciones push (opcional)

- Testing de funcionalidad PWA

### ✅ **Fase 7: Despliegue (1 semana)**

- Hospedar en Vercel, Netlify o Firebase Hosting

- Probar en diferentes dispositivos

- Documentar el uso

---

## 🧪 **Herramientas de testing**

- Chrome DevTools (PWA Audit)

- Testing manual en móvil y escritorio

- Simular modo offline

---

## 🚀 **Funcionalidades extra (futuras)**

- Asignar tareas a otros usuarios

- Integración con Google Calendar

- Estimación de tiempos con IA

- Exportar tareas a PDF o CSV