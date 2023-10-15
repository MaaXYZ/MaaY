import App from '@/App.vue'
import { createApp } from 'vue'

import './assets/base.css'
import router from './router'
import { setupMaa } from './stores/maa'

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

window.ipcRenderer.on('renderer.core.log', (_, str) => {
  console.log(str)
})

setupMaa()

createApp(App).use(router).mount('#app')
