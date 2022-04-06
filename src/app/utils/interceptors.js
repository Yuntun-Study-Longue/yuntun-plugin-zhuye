import axios from 'axios'

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return { ...config, url: 'https://api.yuntun-bj.com' + config.url };
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);