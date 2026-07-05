import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      // Using 'instant' to avoid visual jumping during Framer Motion transitions.
      // The page will instantly start at the top when the route changes.
      behavior: 'instant' 
    });
  }, [pathname]);

  return null;
};
