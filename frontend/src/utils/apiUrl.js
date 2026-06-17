export const getApiBaseUrl = () => {
  const explicitUrl = import.meta.env.VITE_API_URL?.trim();

  const normalizeUrl = (value) => {
    try {
      const parsed = new URL(value);
      parsed.hostname = parsed.hostname.replace(/_/g, '-');
      return parsed.toString().replace(/\/$/, '');
    } catch {
      return value.replace(/_/g, '-').replace(/\/$/, '');
    }
  };

  if (explicitUrl) {
    return normalizeUrl(explicitUrl);
  }

  if (import.meta.env.PROD) {
    return 'https://carbon-footprint-tracker-nzz9.onrender.com';
  }

  return 'http://localhost:5000';
};