import Vue from 'vue'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import vuetify from './plugins/vuetify';
import VueClipboard from 'vue-clipboard2'
import VueRouter from 'vue-router'
import routes from './routes'
const NotFound = { template: '<p>Page not found</p>' }


Vue.use(VueRouter)
Vue.use(VueClipboard);
Vue.use(element);
Vue.config.productionTip = false

const app = new Vue({
  vuetify,
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || NotFound
    }
  },
  render (h) {
    return h(this.ViewComponent)
  },
})

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname
})
