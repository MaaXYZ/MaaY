module.exports = {
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip'
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          {
            entry: 'app/main/src/main.js',
            config: 'app/main/vite.config.ts'
          },
          {
            entry: 'app/preload/src/main.js',
            config: 'app/preload/vite.config.ts'
          }
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'app/renderer/vite.config.ts'
          }
        ]
      }
    }
  ]
}
