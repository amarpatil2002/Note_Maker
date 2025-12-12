import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/auth",
  withCredentials: true,
});

// let accessToken = null
export const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};
export const clearAccessToken = () => {
  localStorage.removeItem("accessToken");
};

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors & refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Prevent recursion on refresh-token endpoint
    if (original.url.includes("refresh-token")) {
      return Promise.reject(error);
    }

    // If token expired (401) and retry not done
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        console.log(
          "Axios interceptor: token expired for",
          original.url,
          "-> attempting refresh"
        );
        // Call refresh-token API
        const res = await axios.post(
          "http://localhost:4000/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken; // FIXED KEY

        // Save new access token
        localStorage.setItem("accessToken", newAccessToken);
        console.log(
          "Axios interceptor: refresh successful, new access token set"
        );

        // Update headers for retry
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        original.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // retry original request
        return api(original);
      } catch (err) {
        console.log(
          "Refresh token failed",
          err?.response?.status,
          original.url
        );
        localStorage.removeItem("accessToken");
        // dispatch a logout event for centralized handling
        window.dispatchEvent(new Event("authLogout"));
        
      }
    }

    // If not a 401 error → reject normally
    return Promise.reject(error);
  }
);

export default api;
