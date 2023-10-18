import Devices from '@/views/Devices'
import Instances from '@/views/Instances'
import Resources from '@/views/Resources'
import Settings from '@/views/Settings'
import Welcome from '@/views/Welcome'
import { type RouteRecordRaw, createMemoryHistory, createRouter } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    components: Welcome
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
  },
  {
    path: '/instances',
    components: Instances
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
