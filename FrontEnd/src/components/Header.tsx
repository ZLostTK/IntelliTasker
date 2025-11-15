import { Calendar, List, Plus, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  view: 'list' | 'calendar';
  onViewChange: (view: 'list' | 'calendar') => void;
  onCreateTask: () => void;
}

function Header({ view, onViewChange, onCreateTask }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className={`border-b shadow-sm transition-colors ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-3 xs:py-4 sm:py-6 max-w-7xl">
        <div className="flex flex-col gap-3 xs:gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className={`text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Administrador de Tareas
              </h1>
              <p className={`mt-1 text-xs xs:text-sm hidden sm:block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Organiza y gestiona tus proyectos eficientemente
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={`Cambiar a ${isDark ? 'modo claro' : 'modo oscuro'}`}
                aria-label={`Cambiar a ${isDark ? 'modo claro' : 'modo oscuro'}`}
              >
                {isDark ? <Sun size={18} className="xs:w-5 xs:h-5" /> : <Moon size={18} className="xs:w-5 xs:h-5" />}
              </button>

              <button
                onClick={onCreateTask}
                className="flex items-center gap-1 xs:gap-2 px-2 xs:px-3 sm:px-4 lg:px-5 py-2 xs:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md font-medium text-xs xs:text-sm sm:text-base whitespace-nowrap"
                aria-label="Crear nueva tarea"
              >
                <Plus size={16} className="xs:w-5 xs:h-5 flex-shrink-0" />
                <span className="hidden sm:inline">Nueva Tarea</span>
                <span className="sm:hidden">Nueva</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center xs:justify-start">
            <div className={`flex rounded-lg p-1 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <button
                onClick={() => onViewChange('list')}
                className={`flex items-center gap-1 xs:gap-2 px-3 xs:px-4 sm:px-5 py-2 rounded-md transition-all ${
                  view === 'list'
                    ? isDark ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                    : isDark ? 'text-slate-200 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Vista de lista"
              >
                <List size={16} className="xs:w-[18px] xs:h-[18px]" />
                <span className="font-medium text-xs xs:text-sm">Lista</span>
              </button>
              <button
                onClick={() => onViewChange('calendar')}
                className={`flex items-center gap-1 xs:gap-2 px-3 xs:px-4 sm:px-5 py-2 rounded-md transition-all ${
                  view === 'calendar'
                    ? isDark ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                    : isDark ? 'text-slate-200 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Vista de calendario"
              >
                <Calendar size={16} className="xs:w-[18px] xs:h-[18px]" />
                <span className="font-medium text-xs xs:text-sm hidden sm:inline">Calendario</span>
                <span className="font-medium text-xs xs:text-sm sm:hidden">Cal.</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
