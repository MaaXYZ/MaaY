module.exports = {
  packagerConfig: {
    ignore: filepath => {
      if (filepath.length === 0) {
        return false
      }
      if (/^\/dist/.test(filepath)) {
        return false
      }
      if (/^\/package.json/.test(filepath)) {
        return false
      }
      return true
    }
  }
}
