import { useState } from 'react';
import { Edit2, Trash2, Clock, CheckCircle2, Circle, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Task } from '../types/task';
import { useTheme } from '../context/ThemeContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (task: Task) => void;
}

function TaskCard({ task, onEdit, onDelete, onUpdate }: TaskCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showSubtasks, setShowSubtasks] = useState(false);

  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtasksHours = task.subtasks.reduce((sum, st) => sum + st.estimatedHours, 0);
  const completionPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const toggleSubtask = (subtaskId: string) => {
    const updatedTask = {
      ...task,
      subtasks: task.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      ),
    };
    onUpdate(updatedTask);
  };

  const toggleTaskCompletion = () => {
    const updatedTask = {
      ...task,
      completed: !task.completed,
    };
    onUpdate(updatedTask);
  };

  // Determine if task is completed
  const isTaskCompleted = totalSubtasks > 0
    ? completedSubtasks === totalSubtasks
    : task.completed;

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`rounded-xl shadow-sm border transition-all overflow-hidden hover:shadow-lg h-full flex flex-col ${
      isDark
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-slate-200'
    }`}>
      <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3 lg:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 mr-2 min-w-0">
            {totalSubtasks === 0 && (
              <button
                onClick={toggleTaskCompletion}
                className={`flex-shrink-0 transition-colors ${
                  isDark ? 'text-slate-300 hover:text-green-400' : 'text-slate-400 hover:text-green-600'
                }`}
                title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
              >
                {task.completed ? (
                  <CheckCircle2 size={20} className="sm:w-6 sm:h-6 text-green-500" />
                ) : (
                  <Circle size={20} className="sm:w-6 sm:h-6" />
                )}
              </button>
            )}
            <h3 className={`text-base sm:text-lg font-bold flex-1 truncate ${
              isTaskCompleted
                ? `line-through ${isDark ? 'text-slate-400' : 'text-slate-400'}`
                : isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {task.title}
            </h3>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(task)}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                isDark
                  ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              aria-label="Editar tarea"
            >
              <Edit2 size={16} className="sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                isDark
                  ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300'
                  : 'text-red-600 hover:bg-red-50'
              }`}
              aria-label="Eliminar tarea"
            >
              <Trash2 size={16} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className={`text-xs sm:text-sm mb-3 lg:mb-4 line-clamp-2 lg:line-clamp-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {task.description}
          </p>
        )}

        <div className="space-y-2 mb-3 lg:mb-4">
          <div className={`flex items-center gap-2 text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <Calendar size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{formatDateTime(task.startDateTime)} - {formatDateTime(task.endDateTime)}</span>
          </div>
          <div className={`flex items-center gap-2 text-xs sm:text-sm flex-wrap ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <Clock size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="font-medium">{task.estimatedHours}h estimadas</span>
            {totalSubtasks > 0 && (
              <span className={isDark ? 'text-slate-400' : 'text-slate-400'}>({subtasksHours}h en subtareas)</span>
            )}
          </div>
        </div>

        {totalSubtasks > 0 && (
          <>
            <div className="mb-3 lg:mb-4 mt-auto">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Progreso</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </div>
              <div className={`w-full rounded-full h-2 sm:h-2.5 overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div
                  className="bg-green-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setShowSubtasks(!showSubtasks)}
              className={`flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors w-full justify-center py-2 ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              {showSubtasks ? <ChevronUp size={16} className="sm:w-4 sm:h-4" /> : <ChevronDown size={16} className="sm:w-4 sm:h-4" />}
              <span>{showSubtasks ? 'Ocultar' : 'Ver'} subtareas ({totalSubtasks})</span>
            </button>
          </>
        )}
      </div>

      {showSubtasks && totalSubtasks > 0 && (
        <div className={`border-t p-3 sm:p-4 ${
          isDark
            ? 'border-slate-700 bg-slate-700/50'
            : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="space-y-2">
            {task.subtasks.map(subtask => (
              <div
                key={subtask.id}
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 hover:border-slate-500'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleSubtask(subtask.id)}
                  className={`flex-shrink-0 transition-colors ${
                    isDark ? 'text-slate-300 hover:text-green-400' : 'text-slate-400 hover:text-green-600'
                  }`}
                  aria-label={subtask.completed ? 'Marcar subtarea como pendiente' : 'Marcar subtarea como completada'}
                >
                  {subtask.completed ? (
                    <CheckCircle2 size={18} className="sm:w-5 sm:h-5 text-green-500" />
                  ) : (
                    <Circle size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs sm:text-sm font-medium truncate ${
                    subtask.completed
                      ? `line-through ${isDark ? 'text-slate-400' : 'text-slate-400'}`
                      : isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {subtask.title}
                  </p>
                </div>
                <span className={`flex-shrink-0 text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                  {subtask.estimatedHours}h
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
