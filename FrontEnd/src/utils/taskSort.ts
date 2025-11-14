import { Task } from '../types/task';

export type SortOption = 'recent' | 'oldest' | 'dueDate' | 'title' | 'progress' | 'duration';
export type FilterOption = 'all' | 'completed' | 'inProgress' | 'overdue' | 'today';

export function sortTasks(tasks: Task[], sortBy: SortOption): Task[] {
  const tasksCopy = [...tasks];

  switch (sortBy) {
    case 'recent':
      return tasksCopy.sort((a, b) => {
        const timeA = new Date(a.startDateTime).getTime();
        const timeB = new Date(b.startDateTime).getTime();
        return timeB - timeA;
      });

    case 'oldest':
      return tasksCopy.sort((a, b) => {
        const timeA = new Date(a.startDateTime).getTime();
        const timeB = new Date(b.startDateTime).getTime();
        return timeA - timeB;
      });

    case 'dueDate':
      return tasksCopy.sort((a, b) => {
        const timeA = new Date(a.endDateTime).getTime();
        const timeB = new Date(b.endDateTime).getTime();
        return timeA - timeB;
      });

    case 'title':
      return tasksCopy.sort((a, b) => a.title.localeCompare(b.title, 'es'));

    case 'progress': {
      return tasksCopy.sort((a, b) => {
        const progressA = a.subtasks.length > 0
          ? a.subtasks.filter(st => st.completed).length / a.subtasks.length
          : 0;
        const progressB = b.subtasks.length > 0
          ? b.subtasks.filter(st => st.completed).length / b.subtasks.length
          : 0;
        return progressB - progressA;
      });
    }

    case 'duration':
      return tasksCopy.sort((a, b) => b.estimatedHours - a.estimatedHours);

    default:
      return tasksCopy;
  }
}

export function filterTasks(tasks: Task[], filterBy: FilterOption): Task[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (filterBy) {
    case 'completed':
      return tasks.filter(task => {
        // Task without subtasks: check task.completed field
        if (task.subtasks.length === 0) return task.completed;
        // Task with subtasks: check if all subtasks are completed
        return task.subtasks.every(st => st.completed);
      });

    case 'inProgress':
      return tasks.filter(task => {
        // Task without subtasks: check if task is not completed
        if (task.subtasks.length === 0) return !task.completed;
        // Task with subtasks: check if not all subtasks are completed
        return !task.subtasks.every(st => st.completed);
      });

    case 'overdue':
      return tasks.filter(task => {
        const endTime = new Date(task.endDateTime);
        return endTime < now;
      });

    case 'today':
      return tasks.filter(task => {
        const startDate = new Date(task.startDateTime);
        const endDate = new Date(task.endDateTime);
        const taskStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const taskEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        return taskStart <= today && taskEnd >= today;
      });

    case 'all':
    default:
      return tasks;
  }
}

export function getTaskStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(task => {
    // Task without subtasks: check task.completed field
    if (task.subtasks.length === 0) return task.completed;
    // Task with subtasks: check if all subtasks are completed
    return task.subtasks.every(st => st.completed);
  }).length;
  const inProgress = tasks.filter(task => {
    // Task without subtasks: check if task is not completed
    if (task.subtasks.length === 0) return !task.completed;
    // Task with subtasks: check if not all subtasks are completed
    return !task.subtasks.every(st => st.completed);
  }).length;
  const overdue = tasks.filter(task => {
    const endTime = new Date(task.endDateTime);
    return endTime < new Date();
  }).length;

  return { total, completed, inProgress, overdue };
}
