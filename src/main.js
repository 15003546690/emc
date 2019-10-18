import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import Mint from 'mint-ui';
import 'element-ui/lib/theme-chalk/index.css';
import browser from './assets/js/chrome.js';
import store from './assets/js/store.js';
import './assets/js/common.js'
import './assets/js/axios.js';
import './style/index.scss';
import './assets/iconfont/iconfont.css'
import 'mint-ui/lib/style.css';
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Mint);
Vue.prototype.$webKit=browser.versions.webKit;//判断内核
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
