const DEFAULT_API_BASE_URL = 'http://localhost:8000';

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof body === 'object' && body !== null && 'detail' in body
        ? body.detail
        : 'The expense API request failed.';

    throw new Error(Array.isArray(message) ? message[0]?.msg : message);
  }

  return body;
}

export const expenseApi = {
  listExpenses(category) {
    const params = new URLSearchParams();

    if (category && category !== 'All') {
      params.set('category', category);
    }

    const query = params.toString();
    return request(`/api/expenses${query ? `?${query}` : ''}`);
  },

  getSummary(category) {
    const params = new URLSearchParams();

    if (category && category !== 'All') {
      params.set('category', category);
    }

    const query = params.toString();
    return request(`/api/expenses/summary${query ? `?${query}` : ''}`);
  },
};

export { apiBaseUrl };
