import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

// Initialize a client to manage API data cache for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Do not refetch API when user switches window tabs
      retry: 1, // If failed, retry only once
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        
        {/* Global Toast Notification Container */}
        <Toaster 
          position="top-right" 
          reverseOrder={false} 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#333333',
              borderRadius: '1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
              border: '1px solid #f0f7f8'
            }
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}