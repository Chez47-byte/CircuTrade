
import axios from "axios";

console.log("BASE_URL:", import.meta.env.VITE_API_URL);
console.log("RZP_KEY:", import.meta.env.VITE_RAZORPAY_KEY_ID);

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
