import apiClient from '@lib/AxiosClient';

const mainServices = {
  getCurrentUser: (filter?: object) => {
    const url = 'auth/me';
    return apiClient.get(url, { params: filter });
  }
};

export default mainServices;
