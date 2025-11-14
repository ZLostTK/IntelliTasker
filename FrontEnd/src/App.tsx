import { useState, useMemo } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import CalendarView from './components/CalendarView';
import Header from './components/Header';
import TaskFilter from './components/TaskFilter';
import { Task } from './types/task';
import { sortTasks, filterTasks, SortOption, FilterOption } from './utils/taskSort';
import { useTheme } from './context/ThemeContext';

function App() {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks;

    result = filterTasks(result, filterBy);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    result = sortTasks(result, sortBy);

    return result;
  }, [tasks, filterBy, searchQuery, sortBy]);

  const handleCreateTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
    setIsFormOpen(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
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
    <div className={bgClass}>
      <Header
        view={view}
        onViewChange={setView}
        onCreateTask={handleOpenForm}
      />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
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

        {view === 'list' ? (
          <TaskList
            tasks={filteredAndSortedTasks}
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
  );
}

export default App;
