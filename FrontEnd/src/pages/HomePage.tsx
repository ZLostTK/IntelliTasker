import { useState, useEffect, useCallback } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import CalendarView from '../components/CalendarView';
import TaskFilter from '../components/TaskFilter';
import Layout from '../components/Layout';
import { Task } from '../types/task';
import { SortOption, FilterOption } from '../utils/taskSort';
import { useTheme } from '../context/ThemeContext';
import * as api from '../services/api';
import { handleApiError } from '../services/api';

function HomePage() {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar tareas desde el backend
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Convertir filterBy a formato del backend
      let completed: boolean | undefined = undefined;
      if (filterBy === 'completed') {
        completed = true;
      } else if (filterBy === 'inProgress') {
        completed = false;
      }
      
      const loadedTasks = await api.getTasks({
        completed,
        sortBy,
        filterBy: filterBy === 'all' ? undefined : filterBy,
        search: searchQuery.trim() || undefined,
        limit: 1000, // Cargar todas las tareas
      });
      
      setTasks(loadedTasks);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error al cargar tareas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, filterBy, searchQuery]);

  // Cargar tareas al montar y cuando cambien los filtros
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = async (task: Omit<Task, 'id'>) => {
    try {
      setError(null);
      const newTask = await api.createTask(task);
      setTasks([...tasks, newTask]);
      setIsFormOpen(false);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      alert(`Error al crear tarea: ${errorMessage}`);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      setError(null);
      const taskData = {
        title: updatedTask.title,
        description: updatedTask.description,
        startDateTime: updatedTask.startDateTime,
        endDateTime: updatedTask.endDateTime,
        estimatedHours: updatedTask.estimatedHours,
        completed: updatedTask.completed,
        subtasks: updatedTask.subtasks.map(st => ({
          title: st.title,
          estimatedHours: st.estimatedHours,
          completed: st.completed,
        })),
      };
      const savedTask = await api.updateTask(updatedTask.id, taskData);
      setTasks(tasks.map(task => task.id === savedTask.id ? savedTask : task));
      setEditingTask(null);
      setIsFormOpen(false);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      alert(`Error al actualizar tarea: ${errorMessage}`);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      return;
    }
    
    try {
      setError(null);
      await api.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      alert(`Error al eliminar tarea: ${errorMessage}`);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleOpenForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const bgClass = theme === 'dark'
    ? 'min-h-screen bg-slate-950'
    : 'min-h-screen bg-gradient-to-br from-slate-50 to-slate-100';

  return (
    <Layout
      view={view}
      onViewChange={setView}
      onCreateTask={handleOpenForm}
    >
      <div className={bgClass}>
        <main className="container mx-auto px-3 xs:px-4 sm:px-6 py-4 xs:py-6 sm:py-8 max-w-[1920px]">
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {view === 'list' && (
          <TaskFilter
            tasks={tasks}
            sortBy={sortBy}
            filterBy={filterBy}
            onSortChange={setSortBy}
            onFilterChange={setFilterBy}
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Cargando tareas...
            </p>
          </div>
        ) : view === 'list' ? (
          <TaskList
            tasks={tasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
          />
        ) : (
          <CalendarView
            tasks={tasks}
            onTaskClick={handleEditTask}
          />
        )}
      </main>

      {isFormOpen && (
        <TaskForm
          task={editingTask}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={handleCloseForm}
        />
      )}
      </div>
    </Layout>
  );
}

export default HomePage;

