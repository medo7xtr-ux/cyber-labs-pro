import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LoadingProvider } from './contexts/LoadingContext';

// المكونات
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute';
import ErrorFallback from './components/common/ErrorFallback';
import getTheme from './styles/theme';

// الصفحات
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Labs from './pages/Labs';
import LabDetail from './pages/LabDetail';
import NotFound from './pages/NotFound';

// إنشاء عميل React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  // يمكن لاحقاً ربط هذا بحالة في Context للتبديل بين الفاتح والداكن
  const mode = 'light'; 
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider 
            maxSnack={3}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={3000}
          >
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <AuthProvider>
                <LoadingProvider>
                  <NotificationProvider>
                    <Router>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                          
                          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                          <Route path="/labs" element={<ProtectedRoute><Labs /></ProtectedRoute>} />
                          <Route path="/labs/:id" element={<ProtectedRoute><LabDetail /></ProtectedRoute>} />
                          
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Layout>
                    </Router>
                  </NotificationProvider>
                </LoadingProvider>
              </AuthProvider>
            </ErrorBoundary>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
