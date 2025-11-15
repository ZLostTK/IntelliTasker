import { Task } from '../types/task';
import TaskCard from './TaskCard';
import { useTheme } from '../context/ThemeContext';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (task: Task) => void;
}

function TaskList({ tasks, onEditTask, onDeleteTask, onUpdateTask }: TaskListProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          No hay tareas
        </h3>
        <p className={`text-center max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Comienza creando tu primera tarea para organizar tu trabajo
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xs:gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onUpdate={onUpdateTask}
        />
      ))}
    </div>
  );
}

export default TaskList;
