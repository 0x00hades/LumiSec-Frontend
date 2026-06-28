import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { MOBILE_NAV_BREAKPOINT } from './MobileNavContext';

export const MOBILE_FEATURE_NAV_BODY_LOCK = 'ls-feature-nav-open';

const MobileFeatureNavContext = createContext(null);

function useMediaMobile() {
  const query = `(max-width: ${MOBILE_NAV_BREAKPOINT}px)`;
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = (event) => setIsMobile(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return isMobile;
}

export function MobileFeatureNavProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaMobile();
  const { pathname } = useLocation();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!isMobile) {
      close();
    }
  }, [isMobile, close]);

  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove(MOBILE_FEATURE_NAV_BODY_LOCK);
      return undefined;
    }

    document.body.classList.add(MOBILE_FEATURE_NAV_BODY_LOCK);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove(MOBILE_FEATURE_NAV_BODY_LOCK);
    };
  }, [isOpen, close]);

  const value = useMemo(
    () => ({ isOpen, isMobile, open, close, toggle }),
    [isOpen, isMobile, open, close, toggle]
  );

  return (
    <MobileFeatureNavContext.Provider value={value}>
      {children}
    </MobileFeatureNavContext.Provider>
  );
}

export function useMobileFeatureNav() {
  const context = useContext(MobileFeatureNavContext);
  if (!context) {
    throw new Error('useMobileFeatureNav must be used within MobileFeatureNavProvider');
  }
  return context;
}

export function useMobileFeatureNavOptional() {
  return useContext(MobileFeatureNavContext);
}
