import { ChevronDown } from 'lucide-react';
import { SortOption, FilterOption, getTaskStats } from '../utils/taskSort';
import { Task } from '../types/task';
import { useTheme } from '../context/ThemeContext';

interface TaskFilterProps {
  tasks: Task[];
  sortBy: SortOption;
  filterBy: FilterOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

function TaskFilter({
  tasks,
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
  onSearch,
  searchQuery,
}: TaskFilterProps) {
  const { theme } = useTheme();
  const stats = getTaskStats(tasks);

  const darkMode = theme === 'dark';
  const bgClass = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const textClass = darkMode ? 'text-slate-900 dark:text-white' : 'text-slate-900';
  const inputClass = darkMode
    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500';
  const buttonClass = darkMode
    ? 'bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600'
    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200';
  const buttonActiveClass = darkMode
    ? 'bg-blue-600 border-blue-500 text-white'
    : 'bg-blue-600 border-blue-500 text-white';

  return (
    <div className={`${bgClass} border rounded-xl p-5 mb-6 shadow-sm`}>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2">Buscar tareas</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Escribe para buscar..."
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${inputClass}`}
            />
          </div>

          <div className="md:flex-1">
            <label className="block text-sm font-semibold mb-2">Ordenar por</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className={`w-full px-4 py-2 border rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${inputClass}`}
              >
                <option value="recent">Más recientes primero</option>
                <option value="oldest">Más antiguas primero</option>
                <option value="dueDate">Por fecha de vencimiento</option>
                <option value="title">Por título (A-Z)</option>
                <option value="progress">Por progreso</option>
                <option value="duration">Por duración (mayor)</option>
              </select>
              <ChevronDown
                size={18}
                className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
              />
            </div>
          </div>

          <div className="md:flex-1">
            <label className="block text-sm font-semibold mb-2">Filtrar</label>
            <div className="relative">
              <select
                value={filterBy}
                onChange={(e) => onFilterChange(e.target.value as FilterOption)}
                className={`w-full px-4 py-2 border rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${inputClass}`}
              >
                <option value="all">Todas las tareas</option>
                <option value="today">Para hoy</option>
                <option value="inProgress">En progreso</option>
                <option value="completed">Completadas</option>
                <option value="overdue">Vencidas</option>
              </select>
              <ChevronDown
                size={18}
                className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className={`px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
            <p className="text-xs font-medium opacity-75">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className={`px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
            <p className="text-xs font-medium opacity-75">Completadas</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className={`px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
            <p className="text-xs font-medium opacity-75">En Progreso</p>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className={`px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
            <p className="text-xs font-medium opacity-75">Vencidas</p>
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskFilter;
