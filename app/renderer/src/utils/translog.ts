export function translateCallback(msg: string, detail: string) {
  const info = JSON.parse(detail)
  switch (msg) {
    case 'Controller.UUIDGot':
      return `已获取UUID: ${info.uuid}`
      break
    case 'Controller.UUIDGetFailed':
      return `获取UUID失败`
      break
    case 'Controller.ResolutionGot':
      return `已获取分辨率: ${info.resolution.width}x${info.resolution.height}`
      break
    case 'Controller.ResolutionGetFailed':
      return `获取分辨率失败`
      break
    case 'Controller.ScreencapInited':
      return `已初始化截图`
      break
    case 'Controller.ScreencapInitFailed':
      return `初始化截图失败`
      break
    case 'Controller.ConnectSuccess':
      return `已连接`
      break
    case 'Controller.ConnectFailed':
      return `连接失败: ${info.why}`
      break

    case 'Resource.StartLoading':
      return `开始加载 ${info.path}`
      break
    case 'Resource.LoadingCompleted':
      return `已加载 ${info.path}`
      break
    case 'Resource.LoadingFailed':
      return `加载 ${info.path} 失败`
      break

    case 'Task.Started':
      return `开始任务 ${info.entry}`
      break
    case 'Task.Completed':
      return `任务 ${info.entry} 完成`
      break
    case 'Task.Failed':
      return `任务 ${info.entry} 失败`
      break
    case 'Task.Stopped':
      return `任务 ${info.entry} 停止`
      break

    default:
      return `${msg}: ${detail}`
      break
  }
}
