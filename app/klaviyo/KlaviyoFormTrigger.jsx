import {useEffect} from 'react';
import {useLocation} from '@remix-run/react';

export function KlaviyoFormTrigger() {
  const location = useLocation();

  useEffect(() => {
    if (window._klOnsite) {
      window._klOnsite.push(['openForm', 'Uq96fh']);
    }
  }, [location.pathname]);

  return null;
}
