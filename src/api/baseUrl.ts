const LOCAL_API_BASE_URL = 'http://localhost:8080';

const getRootComDomain = (hostname: string): string | null => {
  const parts = hostname.toLowerCase().split('.');
  if (parts.length < 2) {
    return null;
  }

  const rootDomain = parts.slice(-2).join('.');
  if (!rootDomain.endsWith('.com')) {
    return null;
  }

  return rootDomain;
};

export const API_BASE_URL = (() => {
  const { protocol, hostname } = window.location;
  const rootDomain = getRootComDomain(hostname);

  if (!rootDomain) {
    return LOCAL_API_BASE_URL;
  }

  return `${protocol}//api.${rootDomain}`;
})();
