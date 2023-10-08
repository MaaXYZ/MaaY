import type { IpcRenderer } from './ipc'

export {}

declare global {
  interface Window {
    // Expose some Api through preload script
    ipcRenderer: IpcRenderer
  }
}
