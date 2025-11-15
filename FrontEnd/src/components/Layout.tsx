import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  view: 'list' | 'calendar';
  onViewChange: (view: 'list' | 'calendar') => void;
  onCreateTask: () => void;
}

function Layout({ children, view, onViewChange, onCreateTask }: LayoutProps) {
  return (
    <>
      <Header
        view={view}
        onViewChange={onViewChange}
        onCreateTask={onCreateTask}
      />
      {children}
    </>
  );
}

export default Layout;

