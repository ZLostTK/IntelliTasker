import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Task } from '../types/task';
import { useTheme } from '../context/ThemeContext';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getTasksForDay = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dayDate = new Date(year, month, day);

    return tasks.filter(task => {
      const taskStart = new Date(task.startDateTime);
      const taskEnd = new Date(task.endDateTime);

      return (
        dayDate >= new Date(taskStart.getFullYear(), taskStart.getMonth(), taskStart.getDate()) &&
        dayDate <= new Date(taskEnd.getFullYear(), taskEnd.getMonth(), taskEnd.getDate())
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const today = new Date();
  const isToday = (day: number) => {
    return today.getDate() === day &&
           today.getMonth() === currentDate.getMonth() &&
           today.getFullYear() === currentDate.getFullYear();
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-2xl shadow-sm border overflow-hidden ${
      isDark
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-slate-200'
    }`}>
      <div className={`p-6 border-b ${
        isDark ? 'border-slate-700' : 'border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-bold capitalize ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {monthName}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMonth}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className={`text-center font-semibold text-sm py-2 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayTasks = getTasksForDay(day);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day}
                className={`aspect-square border rounded-lg p-2 transition-all ${
                  isTodayDate
                    ? isDark ? 'border-blue-600 bg-blue-900/30' : 'border-blue-500 bg-blue-50'
                    : isDark ? 'border-slate-700 hover:border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`text-sm font-semibold mb-1 ${
                  isTodayDate ? 'text-blue-500' : isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {day}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-20">
                  {dayTasks.map(task => {
                    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                    const totalSubtasks = task.subtasks.length;
                    // Task without subtasks: check task.completed field
                    // Task with subtasks: check if all subtasks are completed
                    const isCompleted = totalSubtasks > 0
                      ? completedSubtasks === totalSubtasks
                      : task.completed;

                    return (
                      <button
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className={`w-full text-left px-2 py-1 rounded text-xs truncate transition-colors ${
                          isCompleted
                            ? isDark ? 'bg-green-900/40 text-green-300 hover:bg-green-900/60' : 'bg-green-100 text-green-800 hover:bg-green-200'
                            : isDark ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }`}
                        title={task.title}
                      >
                        <div className="flex items-center gap-1">
                          <Clock size={10} />
                          <span className="truncate">{task.title}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`px-6 py-4 border-t ${
        isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-6 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 border rounded ${
              isDark ? 'bg-blue-900/40 border-blue-600' : 'bg-blue-100 border-blue-300'
            }`}></div>
            <span className={isDark ? 'text-slate-200' : 'text-slate-600'}>Tareas en progreso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 border rounded ${
              isDark ? 'bg-green-900/40 border-green-600' : 'bg-green-100 border-green-300'
            }`}></div>
            <span className={isDark ? 'text-slate-200' : 'text-slate-600'}>Tareas completadas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 border-2 rounded ${
              isDark ? 'bg-slate-700 border-blue-600' : 'bg-blue-50 border-blue-500'
            }`}></div>
            <span className={isDark ? 'text-slate-200' : 'text-slate-600'}>Hoy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
