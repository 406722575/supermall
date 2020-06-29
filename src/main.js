import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from "vue-lazyload";
import toast from 'components/common/toast'
import FastClick from 'fastclick'

Vue.use(VueLazyload,{
  loading: require('./assets/img/common/placeholder.png')
});
Vue.use(toast);
FastClick.attach(document.body)

Vue.config.productionTip = false
// 创建一个$bus且为实例
Vue.prototype.$bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
