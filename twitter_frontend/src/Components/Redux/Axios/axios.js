import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authTokens");
    const tokens = JSON.parse(token);
    const accessToken = tokens?.access;
    if (token) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
