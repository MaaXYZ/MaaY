import { createApp } from 'vue'

import App from '@/App.vue'

import './assets/base.css'
import router from './router'
import { register_init_logic } from './stores/init'

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

window.ipcRenderer.on('renderer.core.log', (_, str) => {
  console.log(str)
})

register_init_logic()

createApp(App).use(router).mount('#app')
