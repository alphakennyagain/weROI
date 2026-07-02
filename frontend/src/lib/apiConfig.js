/** Resolve backend base URL (no trailing slash). */
export function getBackendUrl() {
  const fromEnv = (process.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '');
  if (fromEnv) return fromEnv;

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8000';
    }
    return 'https://weroi-production.up.railway.app';
  }

  return '';
}

export function getApiUrl() {
  const base = getBackendUrl();
  return base ? `${base}/api` : '';
}
