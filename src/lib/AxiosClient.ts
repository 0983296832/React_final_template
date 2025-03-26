import axios from 'axios';
import queryString from 'query-string';
import { jwtDecode } from 'jwt-decode';

import { LOCAL_STORAGE_TOKEN_KEY, LOCAL_STORAGE_REFRESH_TOKEN_KEY } from '@constants/index';
import { getBaseUrl } from './HttpHelper';
import { getToken, removeToken, saveToken } from './JwtHelper';
import { useRootStore } from '@store/index';
import { Toast } from '@components/toast';

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`
  },
  paramsSerializer: (params) => queryString.stringify(params)
});

let isRefreshing = false;
let failedQueue: any[] = [];

// 🔹 Hàm gọi API refresh token
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      throw new Error('Không có refresh token!');
    }

    const response = await axios.post(`${getBaseUrl()}auth/refresh`, {
      refreshToken: refreshToken,
      expiresInMins: 30
    });

    const newAccessToken = response.data.accessToken;
    saveToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    useRootStore.getState().onLogout(); // Refresh token không hợp lệ, logout người dùng
    throw error;
  }
};

function decodeToken(token: string) {
  const parts = token.split('.');
  if (parts.length !== 2) {
    return null; // Token không hợp lệ
  }

  const encodedPayload = parts[0];
  const decodedPayload = atob(encodedPayload);

  try {
    return JSON.parse(decodedPayload); // Trả về object JSON
  } catch (error) {
    return null; // Payload không hợp lệ
  }
}
// 🔹 Hàm kiểm tra token có hết hạn hay không
const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  try {
    const decoded = decodeToken(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

// 🟢 Request Interceptor: Gán token vào headers
apiClient.interceptors.request.use(
  async (config) => {
    let accessToken = getToken();

    // Nếu token đã hết hạn, thử refresh trước khi gửi request
    if (accessToken && isTokenExpired(accessToken)) {
      try {
        accessToken = await refreshToken(); // Lấy token mới
      } catch (error) {
        return Promise.reject(error); // Nếu refresh thất bại, reject request
      }
    }

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔴 Response Interceptor: Xử lý lỗi 401
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { config, response } = error;

    if (response && response.status === 401 && !config.__isRetryRequest) {
      console.warn('Token hết hạn, thử refresh...');

      config.__isRetryRequest = true;
      const accessToken = getToken();

      if (!accessToken || isTokenExpired(accessToken)) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newAccessToken) => {
              config.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return axios(config);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          const newAccessToken = await refreshToken();
          saveToken(newAccessToken);
          apiClient.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;

          failedQueue.forEach(({ resolve }) => resolve(newAccessToken));
          failedQueue = [];

          config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(config);
        } catch (err) {
          failedQueue.forEach(({ reject }) => reject(err));
          failedQueue = [];
          useRootStore.getState().onLogout(); // Nếu refresh token không hợp lệ, logout người dùng
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
    }
    Toast('error', error?.response?.data?.message);
    return Promise.reject(error);
  }
);

export default apiClient;
