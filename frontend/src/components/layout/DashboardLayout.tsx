// FILE: frontend/src/components/layout/DashboardLayout.tsx

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NotificationsPanel } from './NotificationsPanel';

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-ink-2 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <NotificationsPanel />
    </div>
  );
};
