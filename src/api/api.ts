import axios from "axios";

export const api = axios.create({
  baseURL: `/api/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // пока так
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const originalRequest = err.config;

//     const isPublicEndpoint = publicEndpoints.some((endpoint) =>
//       originalRequest.url?.includes(endpoint)
//     );

//     if (isPublicEndpoint) {
//       return Promise.reject(err);
//     }

//     if (err.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refresh = localStorage.getItem("refresh");
//         if (!refresh) throw new Error("Нет refresh токена");

//         const { data } = await axios.post<IRefreshResponseData>(
//           "/api/v1/auth/login/refresh/",
//           { refresh },
//         );
//         store.dispatch(setToken({ access: data.access }));
//         localStorage.setItem("refresh", data.refresh);
//         localStorage.setItem("access", data.access);
//         originalRequest.headers["Authorization"] = `Bearer ${data.access}`;

//         return api(originalRequest);
//       } catch (e) {
//         store.dispatch(logout());
//         localStorage.removeItem("refresh");
//         localStorage.removeItem("access");
//         localStorage.removeItem("user");
//         return Promise.reject(e);
//       }
//     }

//     return Promise.reject(err);
//   },
// );
