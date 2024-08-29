import axios from "axios";
import { axiosAuthInstance } from "./axiosConfig";

export default function AxiosProvider() {
  axiosAuthInstance.interceptors.request.use(
    (request) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        request.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return request;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  axiosAuthInstance.interceptors.response.use(
    (response) => response, // Directly return successful responses.
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
        try {
          const refreshToken = localStorage.getItem("refreshToken"); // Retrieve the stored refresh token.
          // Make a request to your auth server to refresh the token.
          const response = await axios.post(
            import.meta.env.VITE_SERVER_URL + "auth/refresh-token",
            {
              refreshToken,
            },
          );
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          // Store the new access and refresh tokens.
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          // Update the authorization header with the new access token.
          axiosAuthInstance.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;

          return axiosAuthInstance(originalRequest); // Retry the original request with the new access token.
        } catch (refreshError) {
          // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
          console.error("Token refresh failed:", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error); // For all other errors, return the error as is.
    },
  );

  return axiosAuthInstance;
}
