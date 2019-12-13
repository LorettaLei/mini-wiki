import axios from 'axios'
import {message} from 'antd'
axios.interceptors.request.use(function (config) {
    if (!config.url.match('http')) {
        config.url = 'http://127.0.0.1:3005'+config.url
    }
    return config;
}, function (error) {
    message.error('网络错误，请稍后重试')
    return Promise.reject(error);
});
  
axios.interceptors.response.use(function (response) {
    return Promise.resolve(response.data);
}, function (error) {
    message.error('网络错误，请稍后重试')
    // 对请求错误做些什么
    return Promise.reject(error);
});
  
export default axios;