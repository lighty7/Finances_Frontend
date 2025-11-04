// Centralized Route Configuration
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
};

// Route metadata for navigation, titles, and guards
export const ROUTE_CONFIG = {
  [ROUTES.LOGIN]: {
    title: 'Login - Budget Tracker',
    requiresAuth: false,
    redirectIfAuthenticated: ROUTES.DASHBOARD,
  },
  [ROUTES.REGISTER]: {
    title: 'Sign Up - Budget Tracker',
    requiresAuth: false,
    redirectIfAuthenticated: ROUTES.DASHBOARD,
  },
  [ROUTES.VERIFY_EMAIL]: {
    title: 'Verify Email - Budget Tracker',
    requiresAuth: false,
    redirectIfAuthenticated: null, // Allow access even if authenticated
  },
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard - Budget Tracker',
    requiresAuth: true,
    redirectIfUnauthenticated: ROUTES.LOGIN,
  },
};

// Helper function to get route config
export const getRouteConfig = (path) => {
  return ROUTE_CONFIG[path] || {
    title: 'Budget Tracker',
    requiresAuth: false,
  };
};

// Helper function to set page title
export const setPageTitle = (path) => {
  const config = getRouteConfig(path);
  document.title = config.title;
};

