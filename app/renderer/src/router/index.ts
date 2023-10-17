import Devices from '@/views/Devices'
import Resources from '@/views/Resources'
import Settings from '@/views/Settings'
import { type RouteRecordRaw, createMemoryHistory, createRouter } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/devices'
  },
  {
    path: '/settings',
    components: Settings
  },
  {
    path: '/devices',
    components: Devices
  },
  {
    path: '/resources',
    components: Resources
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
