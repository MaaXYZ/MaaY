<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import { NConfigProvider, NMessageProvider, NNotificationProvider } from 'naive-ui'

import Command from '@/Command.vue'
import MainSideLayout from '@/layouts/MainSideLayout.vue'

import { setupLocale } from './i18n'

hljs.registerLanguage('json', json)

setupLocale()
</script>

<template>
  <NConfigProvider :hljs="hljs">
    <NMessageProvider>
      <NNotificationProvider placement="bottom-right">
        <Command></Command>
        <MainSideLayout></MainSideLayout>
      </NNotificationProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
