import Vue from "vue";
import axios from "axios";
import envconfig from "./envconfig";
import qs from "qs";
// import store from "@/store/store";
import router from "@/router/router";

// 发起请求前
let loadingInstance = null;

// 状态码错误信息
const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};

// 创建拦截器
let axiosInstance = axios.create();
// 发起请求前
axiosInstance.interceptors.request.use(
  config => {
    // 默认开启loading
    if (!config.LOADINGHIDE) {
      // loadingInstance = Vue.prototype.$loading({
      //   lock: true,
      //   text: "Loading",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
    }
    if (config.method.toUpperCase() !== "GET") {
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
    // loading close...
    loadingInstance && loadingInstance.close();
    if (error) {
      // 请求配置发生的错误
      if (!error.response) {
        return console.log("Error", error.message);
      }

      // 获取状态码
      const status = error.response.status;
      const errortext = codeMessage[status] || error.response.statusText;

      // 提示错误信息
      Vue.prototype.$message({
        message: errortext,
        type: "error"
      });

      // 错误状态处理
      if (status === 401) {
        router.push("/login");
      } else if (status === 403) {
        router.push("/login");
      } else if (status >= 404 && status < 422) {
        router.push("/404");
      }
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
          headers: {}
          // withCredentials: true, //是否携带cookies发起请求
        },
        config
      );
      // 添加token
      // _option.headers = {
      //   ..._option.headers,
      //   authorization: "Bearer " + store.getters.token
      // };
      // 处理get、post传参问题
      method.toUpperCase() !== "GET"
        ? (_option.data = params)
        : (_option.params = params);

      // 请求成功后服务器返回二次处理
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
