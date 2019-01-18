import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  /**
   * @route{
   *  name: 组件名称（ 使用keepAlive必须在组件内声明组件name, 请与此name一致， 区分大小写）
   * }
   * @meta {
   *  title: 页面标题（document.title）
   *  keepAlive: 是否启用缓存
   *  isTransition: 是否开启切换动画
   * }
   */
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        name: "home",
        isTransition: true
      }
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "@/views/About.vue")
    }
  ]
});

export default router;
