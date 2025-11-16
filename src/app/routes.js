/**
 * Centralized Route Configuration
 * Industry-standard route management with clear separation of protected and unprotected routes
 */

// Route path constants
export const ROUTES = {
  // Public Routes (Unprotected)
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  
  // Protected Routes (Require Authentication)
  DASHBOARD: '/dashboard',
  CONFIGURATION: '/configuration',
  
  // Fallback
  HOME: '/',
  NOT_FOUND: '*',
};

/**
 * Route Configuration
 * Defines route metadata including authentication requirements, titles, and redirects
 */
export const ROUTE_CONFIG = {
  // ========== PUBLIC ROUTES (Unprotected) ==========
  [ROUTES.LOGIN]: {
    title: 'Login - Budget Tracker',
    requiresAuth: false,
    isPublic: true,
    redirectIfAuthenticated: ROUTES.DASHBOARD, // Redirect to dashboard if already logged in
    meta: {
      description: 'Login to your account',
    },
  },
  [ROUTES.REGISTER]: {
    title: 'Sign Up - Budget Tracker',
    requiresAuth: false,
    isPublic: true,
    redirectIfAuthenticated: ROUTES.DASHBOARD, // Redirect to dashboard if already logged in
    meta: {
      description: 'Create a new account',
    },
  },
  [ROUTES.VERIFY_EMAIL]: {
    title: 'Verify Email - Budget Tracker',
    requiresAuth: false,
    isPublic: true,
    redirectIfAuthenticated: null, // Allow access even if authenticated (for email verification flow)
    meta: {
      description: 'Verify your email address',
    },
  },
  
  // ========== PROTECTED ROUTES (Require Authentication) ==========
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard - Budget Tracker',
    requiresAuth: true,
    isPublic: false,
    redirectIfUnauthenticated: ROUTES.LOGIN,
    meta: {
      description: 'Your financial dashboard',
      roles: [], // Can be extended for role-based access control
    },
  },
  [ROUTES.CONFIGURATION]: {
    title: 'Configuration - Budget Tracker',
    requiresAuth: true,
    isPublic: false,
    redirectIfUnauthenticated: ROUTES.LOGIN,
    meta: {
      description: 'Application settings',
      roles: [],
    },
  },
  
  // ========== SPECIAL ROUTES ==========
  [ROUTES.HOME]: {
    title: 'Budget Tracker',
    requiresAuth: false,
    isPublic: true,
    redirectIfAuthenticated: ROUTES.DASHBOARD,
    redirectIfUnauthenticated: ROUTES.LOGIN,
    meta: {
      description: 'Home page',
    },
  },
  [ROUTES.NOT_FOUND]: {
    title: '404 - Page Not Found',
    requiresAuth: false,
    isPublic: true,
    meta: {
      description: 'Page not found',
    },
  },
};

/**
 * Get route configuration for a given path
 * @param {string} path - The route path
 * @returns {Object} Route configuration object
 */
export const getRouteConfig = (path) => {
  return ROUTE_CONFIG[path] || {
    title: 'Budget Tracker',
    requiresAuth: false,
    isPublic: true,
    meta: {
      description: '',
    },
  };
};

/**
 * Check if a route requires authentication
 * @param {string} path - The route path
 * @returns {boolean} True if route requires authentication
 */
export const isProtectedRoute = (path) => {
  const config = getRouteConfig(path);
  return config.requiresAuth === true;
};

/**
 * Check if a route is public (unprotected)
 * @param {string} path - The route path
 * @returns {boolean} True if route is public
 */
export const isPublicRoute = (path) => {
  const config = getRouteConfig(path);
  return config.isPublic === true;
};

/**
 * Get redirect path for authenticated users
 * @param {string} path - The route path
 * @returns {string|null} Redirect path or null
 */
export const getRedirectIfAuthenticated = (path) => {
  const config = getRouteConfig(path);
  return config.redirectIfAuthenticated || null;
};

/**
 * Get redirect path for unauthenticated users
 * @param {string} path - The route path
 * @returns {string|null} Redirect path or null
 */
export const getRedirectIfUnauthenticated = (path) => {
  const config = getRouteConfig(path);
  return config.redirectIfUnauthenticated || null;
};

/**
 * Set page title based on route
 * @param {string} path - The route path
 */
export const setPageTitle = (path) => {
  const config = getRouteConfig(path);
  document.title = config.title;
};

/**
 * Get all protected routes
 * @returns {Array<string>} Array of protected route paths
 */
export const getProtectedRoutes = () => {
  return Object.entries(ROUTE_CONFIG)
    .filter(([_, config]) => config.requiresAuth === true)
    .map(([path]) => path);
};

/**
 * Get all public routes
 * @returns {Array<string>} Array of public route paths
 */
export const getPublicRoutes = () => {
  return Object.entries(ROUTE_CONFIG)
    .filter(([_, config]) => config.isPublic === true)
    .map(([path]) => path);
};

