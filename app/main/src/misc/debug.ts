import { BrowserWindow } from 'electron'

// import installExtension from 'electron-devtools-installer'

function useDebug(window: BrowserWindow): void {
  // installExtension('nhdogjmejiglipccpnnnanhbledajbpd')
  //   .then(name => console.info(`Added Extension: ${name}`))
  //   .catch((err: Error) =>
  //     console.error(`An error occurred while install extension: ${err.message}`)
  //   )

  if ('MAAY_NO_DEVTOOL' in process.env) {
    console.log('disabled devtools')
  } else {
    window.webContents.openDevTools({ mode: 'detach' })
  }

  // Bypass CORS
  const bypass_urls = [
    'https://prts.wiki/*',
    'https://maa.alisaqaq.moe/*',
    'https://penguin-stats.io/*'
  ]
  window.webContents.session.webRequest.onBeforeSendHeaders(
    {
      urls: bypass_urls
    },
    (details, callback) => {
      details.requestHeaders.Origin = new URL(details.url).origin
      callback(details)
    }
  )
  window.webContents.session.webRequest.onHeadersReceived(
    {
      urls: bypass_urls
    },
    (details, callback) => {
      const corsHeader = { 'access-control-allow-origin': '*' }
      details.responseHeaders = Object.assign(details.responseHeaders ?? {}, corsHeader)
      callback(details)
    }
  )
}

export default useDebug
