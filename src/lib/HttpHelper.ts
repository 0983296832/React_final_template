const getBaseUrl = () => {
  const currentURL = window.location.origin; // Lấy URL hiện tại

  if (currentURL.includes('localhost') || currentURL.includes('fe.')) {
    return 'https://dummyjson.com/';
    // return 'https://<your_url>.com/';
  } else {
    return currentURL + '/';
  }
};

export { getBaseUrl };
