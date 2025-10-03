import axios from 'axios';

type ApiConfig = {
  baseURL: string;
};

const config: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api',
};

export const useMockData = (import.meta.env.VITE_USE_MOCK_DATA ?? 'false') === 'true';

export const apiClient = axios.create({
  baseURL: config.baseURL,
  withCredentials: true,
});

const assetOrigin = (() => {
  try {
    return new URL(config.baseURL).origin;
  } catch {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  }
})();

export const resolveAssetUrl = (url: string | null | undefined) => {
  if (!url) {
    return '';
  }
  if (/^(https?:|data:)/i.test(url)) {
    return url;
  }
  const normalized = url.startsWith('/') ? url : `/${url}`;
  return `${assetOrigin}${normalized}`;
};
