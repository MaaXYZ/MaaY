import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider'
import { reactive } from 'vue'

const handlers = reactive<Record<string, () => Promise<boolean>>>({})
let message: MessageApiInjection
let notification: NotificationApiInjection

function register(cmd: string, handle: () => Promise<boolean>) {
  handlers[cmd] = handle
}

function setup(msg: MessageApiInjection, notify: NotificationApiInjection) {
  message = msg
  notification = notify
  register('debug.test-notification', async () => {
    notification.create({
      title: 'Test Notification',
      content: () => {
        return <div> Notification Content </div>
      },
      duration: 0
    })
    return true
  })
  register('debug.test-message', async () => {
    message.create('Message Content', {
      duration: 0
    })
    return true
  })
}

export const useCommands = {
  handlers,

  register,
  setup
}
