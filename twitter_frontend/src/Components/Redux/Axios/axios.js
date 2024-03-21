import axios from "axios";

const navigateToSignIn = () => {
  window.location.href = '/sign_in';
};


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

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 Unauthorized error, indicating user is not authenticated
      navigateToSignIn()
    }
    return Promise.reject(error);
  }
);

export default axios;
