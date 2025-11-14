import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock } from 'lucide-react';
import { Task, Subtask } from '../types/task';
import { useTheme } from '../context/ThemeContext';

interface TaskFormProps {
  task: Task | null;
  onSave: (task: Task | Omit<Task, 'id'>) => void;
  onClose: () => void;
}

function TaskForm({ task, onSave, onClose }: TaskFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(0);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskHours, setNewSubtaskHours] = useState(1);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStartDateTime(task.startDateTime);
      setEndDateTime(task.endDateTime);
      setEstimatedHours(task.estimatedHours);
      setSubtasks(task.subtasks);
    } else {
      // Reset form when creating new task
      setTitle('');
      setDescription('');
      setStartDateTime('');
      setEndDateTime('');
      setEstimatedHours(0);
      setSubtasks([]);
    }
  }, [task]);

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        title: newSubtaskTitle,
        estimatedHours: newSubtaskHours,
        completed: false,
      };
      setSubtasks([...subtasks, newSubtask]);
      setNewSubtaskTitle('');
      setNewSubtaskHours(1);
    }
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter(st => st.id !== subtaskId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (task) {
      onSave({
        ...task,
        title,
        description,
        startDateTime,
        endDateTime,
        estimatedHours,
        subtasks,
      });
    } else {
      onSave({
        title,
        description,
        startDateTime,
        endDateTime,
        estimatedHours,
        completed: false,
        subtasks,
      });
    }
  };

  const subtasksTotal = subtasks.reduce((sum, st) => sum + st.estimatedHours, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className={`sticky top-0 border-b px-6 py-4 flex items-center justify-between z-10 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {task ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
              }`}
              placeholder="Ej: Desarrollar nueva funcionalidad"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
              }`}
              placeholder="Describe los detalles de la tarea..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Fecha y hora de inicio *
              </label>
              <input
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Fecha y hora de fin *
              </label>
              <input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Tiempo estimado total (horas) *
            </label>
            <input
              type="number"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
              }`}
              placeholder="0"
              min="0"
              step="0.5"
              required
            />
          </div>

          <div className={`border-t pt-6 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Subtareas</h3>

            <div className={`rounded-lg p-4 mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark
                      ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                  }`}
                  placeholder="Título de la subtarea"
                />
                <input
                  type="number"
                  value={newSubtaskHours}
                  onChange={(e) => setNewSubtaskHours(Number(e.target.value))}
                  className={`w-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark
                      ? 'bg-slate-600 border-slate-500 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                  min="0.5"
                  step="0.5"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Agregar
                </button>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Ingresa el título y las horas estimadas
              </p>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-2 mb-4">
                {subtasks.map(subtask => (
                  <div
                    key={subtask.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg ${
                      isDark
                        ? 'bg-slate-700 border-slate-600'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {subtask.title}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <Clock size={16} />
                      <span>{subtask.estimatedHours}h</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(subtask.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? 'text-red-400 hover:bg-red-900/30'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {subtasks.length > 0 && (
              <div className={`border rounded-lg p-4 ${
                isDark
                  ? 'bg-blue-900/30 border-blue-800'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-slate-700'}`}>
                    Total de subtareas:
                  </span>
                  <span className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {subtasksTotal}h
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 border rounded-lg transition-colors font-medium ${
                isDark
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              {task ? 'Guardar Cambios' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
