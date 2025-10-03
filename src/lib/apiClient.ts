const normalizeBaseUrl = (value: string | undefined) => {
  if (!value) {
    return "";
  }
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

export const wordpressBaseUrl = normalizeBaseUrl(import.meta.env.VITE_WORDPRESS_BASE_URL);

export const useMockData = (import.meta.env.VITE_USE_MOCK_DATA ?? "false") === "true";

if (!wordpressBaseUrl && !useMockData) {
  console.warn("VITE_WORDPRESS_BASE_URL is not configured. Enable mock data or provide a WordPress base URL.");
}


interface WordpressRequestOptions extends RequestInit {
  query?: Record<string, string | number | boolean | undefined | null>;
}

const buildEndpointUrl = (endpoint: string) => {
  if (!wordpressBaseUrl) {
    throw new Error("VITE_WORDPRESS_BASE_URL is not configured");
  }
  const cleanedEndpoint = endpoint.replace(/^\/?/, "");
  const prefixed = cleanedEndpoint.startsWith("wp-json/")
    ? cleanedEndpoint
    : `wp-json/${cleanedEndpoint}`;
  return new URL(prefixed, `${wordpressBaseUrl}/`);
};

export const wordpressFetch = async <T>(endpoint: string, options: WordpressRequestOptions = {}): Promise<T> => {
  const url = buildEndpointUrl(endpoint);
  const { query, headers, ...requestInit } = options;

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }
      url.searchParams.set(key, String(value));
    });
  }

  const requestHeaders = new Headers(headers ?? {});
  requestHeaders.set("Accept", "application/json");

  const response = await fetch(url, {
    ...requestInit,
    headers: requestHeaders,
  });

  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try {
      const data = await response.json();
      if (typeof data?.message === "string") {
        detail = data.message;
      }
    } catch {
      // ignore JSON parsing failure
    }
    throw new Error(`WordPress request failed (${url.pathname}): ${detail}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
};

export const resolveAssetUrl = (url: string | null | undefined) => {
  if (!url) {
    return "";
  }
  if (/^(https?:|data:)/i.test(url)) {
    return url;
  }
  if (!wordpressBaseUrl) {
    return url;
  }
  const normalized = url.startsWith("/") ? url : `/${url}`;
  return `${wordpressBaseUrl}${normalized}`;
};
