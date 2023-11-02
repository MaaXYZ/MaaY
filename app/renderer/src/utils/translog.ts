export function translateCallback(msg: string, detail: string) {
  const info = JSON.parse(detail)
  switch (msg) {
    case 'Controller.UUIDGot':
      return `已获取UUID: ${info.uuid}`
    case 'Controller.UUIDGetFailed':
      return `获取UUID失败`
    case 'Controller.ResolutionGot':
      return `已获取分辨率: ${info.resolution.width}x${info.resolution.height}`
    case 'Controller.ResolutionGetFailed':
      return `获取分辨率失败`
    case 'Controller.ScreencapInited':
      return `已初始化截图`
    case 'Controller.ScreencapInitFailed':
      return `初始化截图失败`
    case 'Controller.TouchinputInited':
      return `已初始化输入`
    case 'Controller.TouchinputInitFailed':
      return `初始化输入失败`
    case 'Controller.ConnectSuccess':
      return `已连接`
    case 'Controller.ConnectFailed':
      return `连接失败: ${info.why}`

    case 'Resource.StartLoading':
      return `开始加载 ${info.path}`
    case 'Resource.LoadingCompleted':
      return `已加载 ${info.path}`
    case 'Resource.LoadingFailed':
      return `加载 ${info.path} 失败`
    case 'Task.Started':
      return `开始任务 ${info.entry}`
    case 'Task.Completed':
      return `任务 ${info.entry} 完成`
    case 'Task.Failed':
      return `任务 ${info.entry} 失败`
    case 'Task.Stopped':
      return `任务 ${info.entry} 停止`

    default:
      return `${msg}: ${detail}`
  }
}
