import { createApp } from 'vue'
import  router from './router'
import App from './App.vue'
import './index.css'

(function() {
    createApp(App).use(router).mount('#plugin-verusvueapp');
})();
