import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export const RootLayout = () => {
  return (
    <>
      <Outlet />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(13, 21, 40, 0.95)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#F43F5E', secondary: '#fff' },
          },
        }}
      />
    </>
  );
};
