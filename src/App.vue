<template>
  <div id="app">
    <div
      id="nav"
      class="color"
    >
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>
    <transition :name="transitionName">
      <keep-alive
        :max="10"
        :include="keepAlive"
      >
        <navigation>
          <router-view></router-view>
        </navigation>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
import router from "./router/router.js";
export default {
  name: "App",
  data() {
    return {
      transitionName: "",
      keepAlive: []
    };
  },
  created() {
    // 递归路由设置KeepAlive  ***** 注意路由name必须和组件内的name一致 *****
    this.setRouteKeepAlive(router.options.routes);

    // 记录路由,动态给定动画.详细功能https://www.npmjs.com/package/vue-navigation
    this.$navigation.on("forward", to => {
      this.transitionName = to.route.meta.isTransition ? "slide-left" : "";
    });
    this.$navigation.on("back", (to, from) => {
      if (to.route.meta.isTransition || from.route.meta.isTransition) {
        this.transitionName = "slide-right";
      } else {
        this.transitionName = "";
      }
    });
  },
  mounted() {
    console.log(this);
    this.$API.getData({ typeid: 1 }).then(data => {
      console.log(data);
    });
  },
  watch: {
    $route(to) {
      // 设置document.title
      if (to.meta.title) document.title = to.meta.title;
    }
  },
  methods: {
    /**
     * @description: 递归路由设置KeepAlive
     * @param {Array}  routes 路由数据
     * @return: undefined
     * @Date: 2019-05-04 14:57:18
     */
    setRouteKeepAlive(routes) {
      routes.map(item => {
        if (item.children) {
          this.setRouteKeepAlive(item.children);
        } else {
          if (item.meta && item.meta.keepAlive) {
            this.keepAlive.push(item.name);
          }
        }
      });
    }
  }
};
</script>
<style lang="less">
// 全局样式
@import url("common/styles/mixin.less");
</style>

<style lang="less" scope>
#app {
  font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB",
    "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 450ms;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backface-visibility: hidden;
  perspective: 800;
}
.slide-right-enter {
  opacity: 1;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 1;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
