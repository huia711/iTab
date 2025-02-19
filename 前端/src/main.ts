import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 外部
import i18n from "./plugins/i18n"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'


const app = createApp(App)
app.use(store)
app.use(router)
app.use(i18n)
app.use(ElementPlus)



//注册全局指令click-outside
app.directive('clickOutside', {
    mounted(el, binding, vnode, prevVnode) {
      el.__vueClickOutside__ = (event: MouseEvent) => {
        const bindingValue = binding.value;
        const isChild = el.contains(event.target);
        const isSelf = el === event.target;
        const isOutside = isSelf && isChild;
        if (isOutside && typeof bindingValue === 'function') {
            binding.value()
        }
      };
      document.addEventListener('click', el.__vueClickOutside__);
    },
    unmounted(el) {
      document.removeEventListener('click', el.__vueClickOutside__);
      delete el.__vueClickOutside__;
    },
});

app.mount('#app')
