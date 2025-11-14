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
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Administrador de Tareas
            </h1>
            <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Organiza y gestiona tus proyectos eficientemente
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex rounded-lg p-1 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <button
                onClick={() => onViewChange('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  view === 'list'
                    ? isDark ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List size={18} />
                <span className="font-medium">Lista</span>
              </button>
              <button
                onClick={() => onViewChange('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  view === 'calendar'
                    ? isDark ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar size={18} />
                <span className="font-medium">Calendario</span>
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={`Cambiar a ${isDark ? 'modo claro' : 'modo oscuro'}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={onCreateTask}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md font-medium"
            >
              <Plus size={20} />
              Nueva Tarea
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
