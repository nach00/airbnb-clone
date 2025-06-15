const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

const safeCredentials = (object = {}) => {
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  const token = csrfMeta ? csrfMeta.getAttribute('content') : '';
  
  const headers = Object.assign({}, object.headers || {}, {
    'X-CSRF-Token': token,
  });
  
  // Don't set Content-Type for FormData - let browser set it with boundary
  if (!(object.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  return Object.assign({}, object, {
    headers,
    credentials: 'same-origin',
  });
};

export { handleErrors, safeCredentials };