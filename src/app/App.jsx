import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../features/auth/context/AuthContext';
import { ProtectedRoute, PublicRoute, PageTransition } from '../shared/components/ProtectedRoute';
import { ToastContainer } from '../shared/components/Toast';
import { ROUTES } from './routes';
import { PageTitle } from '../shared/hooks/usePageTitle';
import Login from '../features/auth/components/Login';
import Register from '../features/auth/components/Register';
import VerifyEmail from '../features/auth/components/VerifyEmail';
import Dashboard from '../features/dashboard/Dashboard';
import Configuration from '../features/confiiguration/Configuration';

function RootRedirect() {
  const { isAuthenticated, loading, isConfigured, configLoading } = useAuth();
  
  if (loading || configLoading) {
    return null;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  // If authenticated but not configured, route to configuration
  if (!isConfigured) {
    return <Navigate to={ROUTES.CONFIGURATION} replace />;
  }
  
  // If authenticated and configured, route to dashboard
  return <Navigate to={ROUTES.DASHBOARD} replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PageTitle />
        <ToastContainer />
        <Routes>
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicRoute>
                <PageTransition>
                  <Login />
                </PageTransition>
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <PublicRoute>
                <PageTransition>
                  <Register />
                </PageTransition>
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.VERIFY_EMAIL}
            element={
              <PageTransition>
                <VerifyEmail />
              </PageTransition>
            }
          />
          <Route
            path={ROUTES.CONFIGURATION}
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Configuration />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<RootRedirect />} />
          <Route
            path="*"
            element={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <h1>404 - Page Not Found</h1>
                <a href={ROUTES.DASHBOARD}>Go to Dashboard</a>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

