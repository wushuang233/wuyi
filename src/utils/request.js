// axios 封装
import axios from "axios";

// 创建axios请求对象并进行配置
const http = axios.create({
  baseURL: "/api", // 基准url
  timeout: 10000000, // 请求超时
});

// 请求拦截器，配置请求头，携带token
http.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = localStorage.getItem("token");
    // 请求拦截器
    return config;
  },
  (error) => {
    // 请求错误拦截
    return Promise.reject(error);
  }
);

// 响应拦截器，这里处理了一下返回值
http.interceptors.response.use(
  (response) => {
    // 响应拦截器
    return response.data;
  },
  (error) => {
    // 响应错误拦截
    return Promise.reject(error);
  }
);

export default http;
