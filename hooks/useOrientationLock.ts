import { useEffect } from 'react';

export function useOrientationLock() {
  useEffect(() => {
    const lockOrientation = () => {
      if (window.innerWidth < 768) {
        const orientation = (window.screen as any).orientation;
        if (orientation && typeof orientation.lock === 'function') {
          orientation.lock('portrait').catch(() => {});
        }
      }
    };
    lockOrientation();
    window.addEventListener('resize', lockOrientation);
    return () => window.removeEventListener('resize', lockOrientation);
  }, []);
}
