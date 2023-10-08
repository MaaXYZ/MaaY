import SettingsMain from '@/views/Settings/SettingsMain.vue'
import SettingsSide from '@/views/Settings/SettingsSide.vue'
import { type RouteRecordRaw, createMemoryHistory, createRouter } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/settings'
  },
  {
    path: '/settings',
    components: {
      Main: SettingsMain,
      Side: SettingsSide
    }
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
