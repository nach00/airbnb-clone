const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

const safeCredentials = (object) => {
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  return Object.assign(object, {
    headers: Object.assign(object.headers || {}, {
      'X-CSRF-Token': token,
      'Content-Type': 'application/json',
    }),
    credentials: 'same-origin',
  });
};

export { handleErrors, safeCredentials };