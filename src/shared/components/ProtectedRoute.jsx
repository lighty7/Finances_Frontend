import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { 
  ROUTES, 
  getRouteConfig, 
  getRedirectIfAuthenticated,
  getRedirectIfUnauthenticated,
  isProtectedRoute,
  isPublicRoute 
} from '../../app/routes';
import LoadingSpinner from './LoadingSpinner';

/**
 * Protected Route Component
 * Industry-standard route guard for authenticated routes
 * 
 * Features:
 * - Redirects unauthenticated users to login
 * - Preserves intended destination for post-login redirect
 * - Shows loading state during authentication check
 * - Handles route configuration automatically
 * 
 * @param {React.ReactNode} children - The component to render if authenticated
 * @param {string} [fallbackPath] - Optional custom redirect path (defaults to route config)
 */
export const ProtectedRoute = ({ children, fallbackPath = null }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner message="Verifying authentication..." />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Get redirect path from route config or use fallback
    const redirectPath = fallbackPath || getRedirectIfUnauthenticated(location.pathname) || ROUTES.LOGIN;
    
    // Preserve intended destination for redirect after login
    const returnUrl = location.pathname + location.search;
    const loginPath = redirectPath === ROUTES.LOGIN 
      ? `${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(returnUrl)}`
      : redirectPath;
    
    return <Navigate to={loginPath} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

/**
 * Public Route Component
 * Industry-standard route guard for unauthenticated routes
 * 
 * Features:
 * - Redirects authenticated users away from public routes (e.g., login/register)
 * - Allows access to public routes without authentication
 * - Shows loading state during authentication check
 * - Handles route configuration automatically
 * 
 * @param {React.ReactNode} children - The component to render if route is accessible
 * @param {string} [redirectPath] - Optional custom redirect path for authenticated users
 */
export const PublicRoute = ({ children, redirectPath = null }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  // If authenticated and route should redirect authenticated users, redirect
  if (isAuthenticated) {
    const configRedirect = redirectPath || getRedirectIfAuthenticated(location.pathname);
    if (configRedirect) {
      return <Navigate to={configRedirect} replace />;
    }
  }

  // Route is accessible, render the public content
  return <>{children}</>;
};

/**
 * Route Guard Component
 * Universal route guard that automatically applies protection based on route configuration
 * 
 * This is the recommended way to protect routes as it uses the centralized route configuration
 * 
 * @param {React.ReactNode} children - The component to render
 */
export const RouteGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const routeConfig = getRouteConfig(location.pathname);

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  // Handle protected routes
  if (routeConfig.requiresAuth && !isAuthenticated) {
    const redirectPath = routeConfig.redirectIfUnauthenticated || ROUTES.LOGIN;
    const returnUrl = location.pathname + location.search;
    const loginPath = redirectPath === ROUTES.LOGIN 
      ? `${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(returnUrl)}`
      : redirectPath;
    return <Navigate to={loginPath} replace />;
  }

  // Handle public routes that redirect authenticated users
  if (routeConfig.isPublic && isAuthenticated && routeConfig.redirectIfAuthenticated) {
    return <Navigate to={routeConfig.redirectIfAuthenticated} replace />;
  }

  // Route is accessible, render content
  return <>{children}</>;
};

/**
 * Page Transition Wrapper
 * Adds smooth transitions between pages for better UX
 * 
 * @param {React.ReactNode} children - The component to wrap
 */
export const PageTransition = ({ children }) => {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
};

