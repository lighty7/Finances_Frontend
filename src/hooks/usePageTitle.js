import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setPageTitle } from '../config/routes';

/**
 * Hook to manage page title based on current route
 */
export const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    setPageTitle(location.pathname);
  }, [location.pathname]);
};

/**
 * Component to set page title
 */
export const PageTitle = () => {
  usePageTitle();
  return null;
};

