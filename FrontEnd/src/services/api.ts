/**
 * Servicio de API para conectar con el Backend de IntelliTasker.
 * Todas las operaciones de tareas se realizan a través de este servicio.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiError {
  detail: string;
}

/**
 * Convierte un error de la API a un mensaje legible.
 */
function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'detail' in error) {
    return (error as ApiError).detail;
  }
  return 'Error desconocido al comunicarse con el servidor';
}

/**
 * Realiza una petición HTTP con manejo de errores.
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
  }

  // Si la respuesta es 204 No Content, retornar void
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Tipos de ordenamiento soportados por el backend.
 */
export type SortOption = 'recent' | 'oldest' | 'dueDate' | 'title' | 'progress' | 'duration';

/**
 * Tipos de filtrado soportados por el backend.
 */
export type FilterOption = 'all' | 'completed' | 'inProgress' | 'overdue' | 'today';

/**
 * Parámetros para obtener tareas.
 */
export interface GetTasksParams {
  completed?: boolean;
  sortBy?: SortOption;
  filterBy?: FilterOption;
  search?: string;
  skip?: number;
  limit?: number;
}

/**
 * Obtiene todas las tareas con filtros opcionales.
 */
export async function getTasks(params: GetTasksParams = {}): Promise<any[]> {
  const queryParams = new URLSearchParams();
  
  if (params.completed !== undefined) {
    queryParams.append('completed', params.completed.toString());
  }
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  if (params.filterBy) {
    queryParams.append('filterBy', params.filterBy);
  }
  if (params.search) {
    queryParams.append('search', params.search);
  }
  if (params.skip !== undefined) {
    queryParams.append('skip', params.skip.toString());
  }
  if (params.limit !== undefined) {
    queryParams.append('limit', params.limit.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi<any[]>(endpoint);
}

/**
 * Obtiene una tarea por su ID.
 */
export async function getTaskById(taskId: string): Promise<any> {
  return fetchApi<any>(`/tasks/${taskId}`);
}

/**
 * Crea una nueva tarea.
 */
export async function createTask(taskData: Omit<any, 'id' | 'created_at' | 'updated_at'>): Promise<any> {
  return fetchApi<any>('/tasks/', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

/**
 * Actualiza una tarea existente.
 */
export async function updateTask(taskId: string, taskData: Partial<any>): Promise<any> {
  return fetchApi<any>(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });
}

/**
 * Elimina una tarea.
 */
export async function deleteTask(taskId: string): Promise<void> {
  return fetchApi<void>(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
}

/**
 * Genera una tarea usando IA.
 */
export async function generateTaskWithAI(title: string, description?: string): Promise<any> {
  return fetchApi<any>('/ai/generate-task', {
    method: 'POST',
    body: JSON.stringify({
      title: title.trim(),
      description: description?.trim() || undefined,
    }),
  });
}

/**
 * Utilidad para manejar errores de API y mostrar mensajes al usuario.
 */
export { handleApiError };

