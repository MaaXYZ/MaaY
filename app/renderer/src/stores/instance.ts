import { Controller, Instance, type InstanceHandle, Resource } from '@maa/loader'
import type {
  InstanceHandleInfo,
  InstanceSaveInfo,
  RespackControlOption,
  RespackInfo,
  RespackResource
} from '@maa/type'
import { configProviderProps } from 'naive-ui'
import { v4 } from 'uuid'
import { watch } from 'vue'

import { registerSend } from '@/sync'

import { useConfig } from './config'
import { useController } from './controller'
import { useRespack } from './respack'

export const enum RunningState {
  Idle,
  Loading,
  Running
}

const { global } = useConfig

const handles = registerSend('instances', {}, false)

window.ipcRenderer.invoke('main.reload.fetch_instances').then(obj => {
  handles.value = obj
})

function takeInfo(x: InstanceHandleInfo) {
  const y: InstanceSaveInfo = { ...x }
  delete y['runtime']
  return y
}

watch(
  handles,
  v => {
    global.value.preset_instance = global.value.preset_instance ?? {}
    const pi = global.value.preset_instance!
    for (const info of Object.values(v)) {
      pi[info.id] = takeInfo(info)
    }
  },
  {
    deep: true
  }
)

async function create_with(cfg: InstanceSaveInfo) {
  const inst = await Instance.init()
  const res = await Resource.init()
  handles.value[inst.handle] = {
    ...cfg,
    runtime: {
      instance: {
        handle: inst.handle,
        cb: inst.cbId
      },
      resource: {
        handle: res.handle,
        cb: res.cbId
      }
    }
  }
  return inst
}

async function create(name: string, respack: string) {
  return await create_with({
    id: v4(),
    name,
    resource: {
      name: respack,
      config: {},
      entries: [{ entry: 0, config: {} }]
    }
  })
}

function is_created(id: string) {
  return !!Object.values(handles.value).find(x => x.id === id)
}

async function destroy(handle: InstanceHandle) {
  const ii = handles.value[handle]!.runtime
  delete handles.value[handle]
  await (await Instance.init_from(ii.instance.handle, ii.instance.cb)).destroy()
  await (await Resource.init_from(ii.resource.handle, ii.resource.cb)).destroy()
}

async function destroy_all() {
  const hs = Object.keys(handles.value) as InstanceHandle[]
  for (const h of hs) {
    await destroy(h)
  }
}

async function resolve_resource_paths(name: string, target: string, pack: RespackResource) {
  let resPaths: string[] = []
  let res = pack.resource[target]!
  resPaths.push(res.path)
  while (res.extends) {
    res = pack.resource[res.extends]!
    resPaths.push(res.path)
  }
  resPaths = await Promise.all(
    resPaths.reverse().map(p => {
      return window.ipcRenderer.invoke('main.resource.join_path', name, p)
    })
  )
  return resPaths
}

async function resolveResourcePathsForInstance(ii: InstanceHandleInfo, pack: RespackInfo) {
  return resolve_resource_paths(ii.resource.name, ii.resource.target!, pack.config.resource)
}

async function applyDefaultCtrlConfig(
  ctrl: Controller,
  app: RespackInfo['config']['resource']['app']
) {
  if (app.start) {
    await ctrl.set_package_entry(app.start)
  }
  if (app.stop) {
    await ctrl.set_package(app.stop)
  }
  if (app.size) {
    if (app.size.long) {
      // 0 is invalid
      await ctrl.set_long_side(app.size.long)
    } else if (app.size.short) {
      await ctrl.set_short_side(app.size.short)
    }
  }
}

function merge(to: any, from: any) {
  for (const key in from) {
    const v = from[key]
    switch (typeof v) {
      case 'boolean':
      case 'number':
      case 'string':
        to[key] = v
        break
      case 'object':
        if (v instanceof Array) {
          to[key] = JSON.parse(JSON.stringify(v)) // array not merge
        } else {
          if (key in to) {
            merge(to[key], v)
          } else {
            to[key] = JSON.parse(JSON.stringify(v))
          }
        }
        break
    }
  }
}

function buildDiffConfig(
  option: string[],
  optinfo: Record<string, RespackControlOption>,
  config: any
) {
  const result: any = {}
  for (const optkey of option) {
    const option = optinfo[optkey]
    if (!option) {
      continue
    }
    const value = config[optkey] ?? option.default
    if (value === undefined || value === null) {
      continue
    }

    // process inject
    for (const jp of option.inject ?? []) {
      const jps = jp.split('.')
      let key = '_'
      let ptr: any = {
        _: result
      }
      for (const p of jps) {
        if (!(key in ptr)) {
          ptr[key] = {}
        }
        ptr = ptr[key]
        key = p
      }
      ptr[key] = value
    }

    // process case
    switch (option.type) {
      case 'checkbox':
        if (value === true) {
          merge(result, option.case?.true ?? {})
        } else {
          merge(result, option.case?.false ?? {})
        }
        break
      case 'select_string':
      case 'select_number':
        for (const cs of option.case) {
          if (cs.value === value) {
            merge(result, cs.provide ?? {})
            break
          }
        }
        break
    }
  }
  return result
}

function init_res_from(handle: InstanceHandle) {
  return Resource.init_from(
    handles.value[handle]!.runtime.resource.handle,
    handles.value[handle]!.runtime.resource.cb
  )
}

function init_from(handle: InstanceHandle) {
  return Instance.init_from(handle, handles.value[handle]!.runtime.instance.cb)
}

async function run(
  handle: InstanceHandle,
  output: {
    state: RunningState
    current: number | null
  }
) {
  output.state = RunningState.Loading
  output.current = null

  const ii = handles.value[handle]!
  const pack = useRespack.info.value[ii.resource.name]
  if (!pack) {
    return false
  }

  if (!ii.resource.target || ii.resource.entries.length === 0 || !ii.runtime.controller) {
    output.state = RunningState.Idle
    return false
  }

  const resPaths = await resolveResourcePathsForInstance(ii, pack)

  const hres = await init_res_from(handle)
  for (const p of resPaths) {
    await hres.post_path(p).wait()
  }
  if (!(await hres.loaded)) {
    output.state = RunningState.Idle
    return false
  }

  const hctrl = await useController.init_from(ii.runtime.controller!)
  await applyDefaultCtrlConfig(hctrl, pack.config.resource.app)

  const hinst = await init_from(handle)
  await hinst.bind_resource(hres)
  await hinst.bind_controller(hctrl)

  output.state = RunningState.Running

  const globDiff = buildDiffConfig(
    pack.config.control.global?.option ?? [],
    pack.config.control.option,
    ii.resource.config
  )
  for (const [idx, cfg] of ii.resource.entries.entries()) {
    const entry = pack.config.control.entry[cfg.entry]
    if (!entry) {
      continue
    }
    output.current = idx
    const finalDiff = JSON.parse(JSON.stringify(globDiff))
    const localDiff = buildDiffConfig(entry.option ?? [], pack.config.control.option, cfg.config)
    merge(finalDiff, localDiff)
    merge(finalDiff, entry.provide ?? {})

    console.log(entry.task, finalDiff)
    await hinst.post_task(entry.task, finalDiff).wait()
  }

  output.state = RunningState.Idle
  output.current = null
}

export const useInstance = {
  handles,

  create_with,
  create,
  is_created,
  destroy,
  destroy_all,
  init_res_from,
  init_from,
  run,
  resolve_resource_paths
}
