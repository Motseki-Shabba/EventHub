import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

//const baseURL = "https://eventhub-1-ggd5.onrender.com";

export const getAxiosInstace = () => {
  const instance = axios.create({
    baseURL: `${baseURL}`,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};
