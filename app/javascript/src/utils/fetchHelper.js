const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

const safeCredentials = (object = {}) => {
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  const token = csrfMeta ? csrfMeta.getAttribute('content') : '';
  return Object.assign({}, object, {
    headers: Object.assign({}, object.headers || {}, {
      'X-CSRF-Token': token,
      'Content-Type': 'application/json',
    }),
    credentials: 'same-origin',
  });
};

export { handleErrors, safeCredentials };