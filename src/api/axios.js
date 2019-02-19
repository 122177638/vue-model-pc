import Vue from "vue";
import axios from "axios";
import envconfig from "./envconfig";
import qs from "qs";

// 发起请求前
let loadingInstance = null;

let axiosInstance = axios.create();
axiosInstance.interceptors.request.use(
  config => {
    // 默认开启loading
    if (!config.LOADINGHIDE) {
      loadingInstance = Vue.prototype.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    }
    if (config.method.toUpperCase() === "POST") {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  error => {
    Vue.prototype.$message({
      message: "加载超时",
      type: "warning"
    });
    return Promise.reject(error);
  }
);
// 发起请求后
axiosInstance.interceptors.response.use(
  res => {
    let {
      data: { content, status }
    } = res;
    // loading close...
    loadingInstance && loadingInstance.close();
    if (status < 0) {
      Vue.prototype.$msgbox({
        title: "请求错误",
        type: "error",
        message: content
      });
      throw new Error(content);
    }
    return res;
  },
  error => {
    console.log("好多人在访问呀，请重新试试");
    // loading close...
    loadingInstance && loadingInstance.close();
    if (error) {
      let errortime = null;
      clearTimeout(errortime);
      errortime = setTimeout(() => {
        Vue.prototype.$message({
          message: "网络错误",
          type: "error"
        });
        clearTimeout(errortime);
      }, 0);
    }
    return Promise.reject(error);
  }
);

export default class Axios {
  axios(method, url, params, config) {
    return new Promise((resolve, reject) => {
      if (typeof params !== "object") params = {};
      let _option = Object.assign(
        {
          method,
          url,
          baseURL: envconfig.baseURL,
          timeout: 10000,
          headers: null
          // withCredentials: true, //是否携带cookies发起请求
        },
        config
      );
      method.toUpperCase() === "POST"
        ? (_option.data = params)
        : (_option.params = params);
      axiosInstance.request(_option).then(
        res => {
          resolve(res.data);
        },
        error => {
          if (error.response) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        }
      );
    });
  }
}
