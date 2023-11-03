<script setup lang="ts">
import { Edit24Regular } from '@vicons/fluent'
import { NButton, NCard, NIcon, NInput, NModal } from 'naive-ui'
import { v4 } from 'uuid'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import ViewResource from '@/components/Respack/ViewResource.vue'
import { useTr } from '@/i18n'
import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useConfig } from '@/stores/config'
import { useInstance } from '@/stores/instance'
import { useRespack } from '@/stores/respack'
import { maaactive } from '@/utils/maa'

import { curInstanceHandle } from '../Instances/state'
import { curResPack } from './state'

const { t } = useTr()

const { info } = useRespack
const { create } = useInstance
const { global } = useConfig

const router = useRouter()

const rinfo = computed(() => {
  if (curResPack.value !== null) {
    return info.value[curResPack.value]
  } else {
    return null
  }
})

async function requestCreateInst() {
  if (rinfo.value) {
    const inst = await create(rinfo.value.name, rinfo.value.name)
    curInstanceHandle.value = inst.handle
    router.push('/instances')
  }
}

async function requestCreatePreset() {
  if (rinfo.value) {
    const id = v4()
    global.value.preset_instance = global.value.preset_instance ?? {}
    global.value.preset_instance[id] = {
      id,
      name: rinfo.value.name,
      resource: {
        name: rinfo.value.name,
        config: {},
        entries: [{ entry: 0, config: {} }]
      }
    }
    curInstanceHandle.value = id
    router.push('/instances')
  }
}

const showRename = ref(false)
const renameTo = ref('')
const renameLoading = ref(false)

function openRename() {
  if (rinfo.value) {
    showRename.value = true
    renameTo.value = rinfo.value.name
  }
}

async function requestRename() {
  if (!rinfo.value) {
    return
  }
  renameLoading.value = true
  if (await window.ipcRenderer.invoke('main.resource.rename', rinfo.value.name, renameTo.value)) {
    await window.ipcRenderer.invoke('main.resource.refresh')
    showRename.value = false
    renameLoading.value = false
  }
}
</script>

<template>
  <NModal v-model:show="showRename">
    <NCard style="width: 80vw" :title="t('resource.rename.title')">
      <div class="flex gap-2">
        <NInput v-model:value="renameTo" :placeholder="t('resource.rename.placeholder')"></NInput>
        <NButton
          @click="requestRename"
          :disabled="!renameTo || rinfo?.name === renameTo"
          :loading="renameLoading"
        >
          {{ t('global.confirm') }}
        </NButton>
      </div>
    </NCard>
  </NModal>

  <div class="flex flex-col gap-2">
    <template v-if="rinfo">
      <NCard :title="t('resource.info.title')">
        <GridFormLayout>
          <span> {{ t('global.name') }} </span>
          <div class="flex gap-2 items-center">
            <span> {{ rinfo.name }} </span>
            <NButton text @click="openRename">
              <template #icon>
                <NIcon>
                  <Edit24Regular></Edit24Regular>
                </NIcon>
              </template>
            </NButton>
          </div>
          <span> {{ t('resource.info.path') }} </span>
          <span> {{ rinfo.path }} </span>
          <span> {{ t('resource.info.type') }} </span>
          <span>
            {{
              rinfo.link === 'redirect' ? t('resource.info.external') : t('resource.info.internal')
            }}
            {{ rinfo.type === 'repo' ? t('resource.info.repo') : t('resource.info.dir') }}
          </span>
        </GridFormLayout>
      </NCard>
      <NCard :title="t('resource.respack.title')">
        <ViewResource :name="rinfo.name" :pack="rinfo.config.resource"></ViewResource>
      </NCard>
      <NCard :title="t('resource.use.title')">
        <div class="flex gap-2">
          <NButton @click="requestCreateInst" :disabled="!maaactive">
            {{ t('resource.use.new_inst') }}
          </NButton>
          <NButton @click="requestCreatePreset"> {{ t('resource.use.new_preset') }} </NButton>
        </div>
      </NCard>
    </template>
    <div v-else class="flex items-center justify-center">
      <span> {{ t('resource.hint.choose') }} </span>
    </div>
  </div>
</template>
