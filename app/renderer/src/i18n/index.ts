import { computed, watch } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'

import { useModule } from '@/stores/module'

import en from './locales/en.json'
import zh_CN from './locales/zh_CN.json'
import type { LocalizeSchema } from './schema'

const messages = {
  en,
  zh_CN
}

export type Locale = keyof typeof messages

export const i18n = createI18n<LocalizeSchema, Locale, false>({
  legacy: false,
  locale: 'zh_CN',
  fallbackLocale: 'zh_CN'
})

export function useTr() {
  return useI18n<{ message: LocalizeSchema }, Locale>({
    inheritLocale: true,
    useScope: 'local',
    messages
  })
}

export function setupLocale() {
  const locale = computed<Locale>(() => {
    return (useModule.info.value.MaaY?.config as { locale?: Locale })?.locale ?? 'zh_CN'
  })

  watch(
    locale,
    v => {
      i18n.global.locale.value = v
    },
    {
      immediate: true
    }
  )
}
