import { getToken } from "@/utils/cookies";
import axios from "axios";
import { baseURL } from "@/constant/endpoint";

const apiInstance = axios.create({
  baseURL,
});

apiInstance.interceptors.request.use((req) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default apiInstance;
