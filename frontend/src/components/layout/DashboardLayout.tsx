import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NotificationsPanel } from './NotificationsPanel';
import { useUIStore } from '@/store/uiStore';

export const DashboardLayout = () => {
  const { notificationsPanelOpen, setNotificationsPanelOpen } = useUIStore();

  return (
    <div className="flex h-screen bg-navy-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <NotificationsPanel
        isOpen={notificationsPanelOpen}
        onClose={() => setNotificationsPanelOpen(false)}
      />
    </div>
  );
};
