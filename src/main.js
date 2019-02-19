import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/store";
import "./registerServiceWorker";
import "@/common/styles/base.css";
// import "@/common/js/rem.js";
import * as method from "@/common/js/mixin.js";
import API from "@/api/api";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Navigation from "vue-navigation";

// 全局引入element组件，也可按需引入
Vue.use(ElementUI);
// 引入路由记录插件
Vue.use(Navigation, {
  router,
  moduleName: "navigation",
  keyName: "AS"
});
// 全局引入公用方法，也可以在组件中单独引入，推荐在组件中单独引入。
Vue.prototype.$METHOD = method;
// 全局引入API
Vue.prototype.$API = API;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
