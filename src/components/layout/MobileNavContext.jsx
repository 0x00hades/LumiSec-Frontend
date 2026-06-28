import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

export const MOBILE_NAV_BREAKPOINT = 991;
export const MOBILE_NAV_BODY_LOCK = 'ls-mobile-nav-open';

const MobileNavContext = createContext(null);

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

export function MobileNavProvider({ children }) {
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
      document.body.classList.remove(MOBILE_NAV_BODY_LOCK);
      return undefined;
    }

    document.body.classList.add(MOBILE_NAV_BODY_LOCK);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove(MOBILE_NAV_BODY_LOCK);
    };
  }, [isOpen, close]);

  const value = useMemo(
    () => ({ isOpen, isMobile, open, close, toggle }),
    [isOpen, isMobile, open, close, toggle]
  );

  return (
    <MobileNavContext.Provider value={value}>
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav() {
  const context = useContext(MobileNavContext);
  if (!context) {
    throw new Error('useMobileNav must be used within MobileNavProvider');
  }
  return context;
}

export function useMobileNavOptional() {
  return useContext(MobileNavContext);
}
