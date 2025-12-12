import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/auth",
  withCredentials: true,
});

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

    // If token expired (401) and retry not done
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        // Call refresh-token API
        const res = await axios.post(
          "http://localhost:4000/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken; // FIXED KEY

        // Save new access token
        localStorage.setItem("accessToken", newAccessToken);

        // Update headers for retry
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        original.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // retry original request
        return api(original);
      } catch (err) {
        console.log("Refresh token failed");
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // force logout
      }
    }

    // If not a 401 error → reject normally
    return Promise.reject(error);
  }
);

export default api;
