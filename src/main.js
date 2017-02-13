// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import vueResource from 'vue-resource'
import VueRouter from 'vue-router'
// components使用了webpack.base.conf.js下面的别名alias
import goods from 'components/goods/goods'
import ratings from 'components/ratings/ratings'
import sellers from 'components/sellers/sellers'

// 这句是 vue2出现router-link-active，但是没出现<router-view>  的关键
// 全局注册
Vue.use(VueRouter);
Vue.use(vueResource);

// 要切换显示的模板，可以导入组件
// const Foo = { template: '<div>foo</div>' }
// const Bar = { template: '<div>bar</div>' }

const routes = [
  { path: '/goods', component: goods},
  { path: '/ratings', component: ratings },
  { path: '/sellers', component: sellers }
];

const router = new VueRouter({
  linkActiveClass:'active',
  // 注意这是routes，不是routers
  routes // （缩写）相当于 routes: routes
})

new Vue({
  // 可以显示或者省略，但是隐藏挂载时候必须显示el
  el: '#app',
  template: '<App/>',
  components: { App },
  router,
  data: {
    // 一个空的vue实例就可以做到,使用集中的事件处理器
    // 某一个组件内调用事件触发this.$root.eventHub.$emit('eventName', event.target);
    // 另一个组件内调用事件接收, 在组件销毁时接除事件绑定,使用$off方法
    // created:{
    //     this.$root.eventHub.$on('eventName',(target) => {
    //     this.functionName(target)
    //   });
    // },
    // method:{
    //     functionName(target) {
    //     console.log(target);
    //     }
    // }
    eventHub: new Vue()
  }
  })

// router.replace('/goods')


// 设置默认的router-link选项卡，即刷新时候的选项卡
// router.replace('/goods')

// router.go(-1);
// el和挂载 必须至少显示一个
// 以显示或者省略挂载，但是隐藏挂载时候必须显示挂载
// }).$mount('#app');
