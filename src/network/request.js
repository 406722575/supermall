import axios from 'axios'
import qs from "qs";

export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:8000/api/n3',
    timeout: 5000
  });

   // 2.给post请求的data 用qs.stringify转换成URL格式
  if (config.data != null && Object.keys(config.data).length != 0) {
    config.data = qs.stringify(config.data);
  }

  // 3请求拦截
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    console.log(err);
  });

  // 4响应拦截
  instance.interceptors.response.use(res => {
    // console.log(res)
    return res.data.data

  }, err => {
    console.log(err);
  });

  // 3.发送真正的网络请求
  return instance(config)
}
