const getBaseUrl = () => {
  return 'https://community.gadoe.org';
};

/**
 * Very small wrapper around fetch used in sagas.
 *
 * @param {string} endpoint e.g. "wp-json/gadoe/v1/upcoming-events"
 *                          or "/wp-json/gadoe/v1/upcoming-events"
 *                          or full "https://example.com/wp-json/..."
 * @param {object} params   Query params for GET
 * @param {string} method   HTTP method, default "GET"
 */
export const apiFetch = async (endpoint, params = {}, method = 'GET') => {
  let url = endpoint;

  // If it's not absolute, prepend base URL.
  if (!/^https?:\/\//i.test(url)) {
    const base = getBaseUrl();
    url = base.replace(/\/$/, '') + '/' + endpoint.replace(/^\//, '');
  }

  // Attach query string for GET.
  if (method.toUpperCase() === 'GET' && params && Object.keys(params).length) {
    const qs = new URLSearchParams(params).toString();
    url += (url.includes('?') ? '&' : '?') + qs;
  }

  const res = await fetch(url, { method });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Request failed (${res.status} ${res.statusText}) ${text ? '- ' + text : ''}`
    );
  }

  return res.json();
};
