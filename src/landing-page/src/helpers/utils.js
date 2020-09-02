export const readUrlQueryParam = (key) => {
  const params = new URLSearchParams(window.location.hash.split("?")[1]);
  return params.get(key);
};

export const isEmptyObj = (obj) => {
  return Object.keys(obj).length === 0;
};
