<script setup lang="ts">
import { Resource } from '@maa/loader'
import type { RespackResource, RespackResourceTarget } from '@maa/type'
import { NButton, NCard, NModal } from 'naive-ui'
import { ref } from 'vue'

import { useTr } from '@/i18n'
import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useInstance } from '@/stores/instance'
import { maaactive } from '@/utils/maa'
import { translateCallback } from '@/utils/translog'

const { t } = useTr()

const props = defineProps<{
  name: string
  pack: RespackResource
}>()

const showTest = ref(false)
const target = ref<RespackResourceTarget | null>(null)
const resolvedPaths = ref<string[] | null>(null)

async function showTestFor(t: string, cfg: RespackResourceTarget) {
  showTest.value = true
  target.value = cfg
  resolvedPaths.value = null
  resolvedPaths.value = await useInstance.resolve_resource_paths(props.name, t, props.pack)
}

const testLoading = ref(false)
const testLoadMsg = ref<string[]>([])

async function testLoad() {
  testLoading.value = true
  testLoadMsg.value = []
  const res = await Resource.init()
  res.onCallback = (msg, detail) => {
    testLoadMsg.value.push(translateCallback(msg, detail))
  }
  for (const p of resolvedPaths.value ?? []) {
    await res.post_path(p).wait()
  }
  if (await res.loaded) {
    testLoadMsg.value.push(t('resource.respack.test.success'))
  } else {
    testLoadMsg.value.push(t('resource.respack.test.fail'))
  }
  await res.destroy()
  testLoading.value = false
}
</script>

<template>
  <NModal v-model:show="showTest" :mask-closable="!testLoading">
    <NCard style="width: 80vw" v-if="target" :title="target.name">
      <GridFormLayout :right="6">
        <template v-if="target.description">
          <span> {{ t('resource.info.desc') }} </span>
          <span> {{ target.description }} </span>
        </template>
        <span> {{ t('resource.info.path') }} </span>
        <span> {{ target.path }} </span>
        <template v-if="resolvedPaths">
          <span> {{ t('resource.info.full_dep') }} </span>
          <div class="flex flex-col gap-2">
            <span v-for="(p, i) of resolvedPaths" :key="i"> {{ p }} </span>
          </div>
          <span> {{ t('resource.respack.test.test') }} </span>
          <div>
            <NButton @click="testLoad" :loading="testLoading" :disabled="!maaactive">
              {{ t('resource.respack.test.load') }}
            </NButton>
          </div>
          <span> {{ t('resource.respack.test.log') }} </span>
          <div class="flex flex-col gap-0.5">
            <span v-for="(msg, idx) of testLoadMsg" :key="idx"> {{ msg }} </span>
          </div>
        </template>
      </GridFormLayout>
    </NCard>
  </NModal>

  <GridFormLayout>
    <span> {{ t('resource.info.def_start_activity') }} </span>
    <span> {{ pack.app.start ?? t('global.unset') }} </span>
    <span> {{ t('resource.info.def_stop_package') }} </span>
    <span> {{ pack.app.stop ?? t('global.unset') }} </span>
    <span> {{ t('resource.info.orientation') }} </span>
    <span>
      {{
        pack.app.orientation === 'portrait'
          ? t('resource.info.portrait')
          : t('resource.info.landscape')
      }}
    </span>
    <span> {{ t('resource.info.size') }} </span>
    <span>
      {{
        pack.app.size?.short !== undefined
          ? `${t('resource.info.short')} ${pack.app.size?.short}`
          : `${t('resource.info.long')} ${pack.app.size?.long ?? 1280}`
      }}
    </span>
    <span> {{ t('resource.info.respack') }} </span>
    <div class="flex gap-2 flex-wrap">
      <NButton v-for="(cfg, key) in pack.resource" :key="key" @click="showTestFor(key, cfg)">
        {{ cfg.name }}
      </NButton>
    </div>
  </GridFormLayout>
</template>
