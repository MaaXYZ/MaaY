type $<T extends string> = {
  [key in T]: string
}

export type LocalizeSchema = {
  device: {
    info: $<'title' | 'name' | 'adb_path' | 'target_address'>
  }
}
