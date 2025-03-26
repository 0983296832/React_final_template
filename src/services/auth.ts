import axios from 'axios';
import { getBaseUrl } from '@lib/HttpHelper';

const authServices = {
  login: (body: any) => {
    const url = getBaseUrl() + 'auth/login';
    return axios.post(url, body);
  },
  register: (body: any) => {
    const url = getBaseUrl() + 'auth/register';
    return axios.post(url, body);
  }
};

export default authServices;
