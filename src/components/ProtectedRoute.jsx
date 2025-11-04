import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES, getRouteConfig } from '../config/routes';
import LoadingSpinner from './LoadingSpinner';

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (!isAuthenticated) {
    // Store intended destination for redirect after login
    const returnUrl = location.pathname + location.search;
    return <Navigate to={`${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
  }

  return children;
};

/**
 * Public Route Component
 * Redirects to dashboard if already authenticated
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const routeConfig = getRouteConfig(window.location.pathname);

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (isAuthenticated && routeConfig.redirectIfAuthenticated) {
    return <Navigate to={routeConfig.redirectIfAuthenticated} replace />;
  }

  return children;
};

/**
 * Page Transition Wrapper
 * Adds smooth transitions between pages
 */
export const PageTransition = ({ children }) => {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
};
