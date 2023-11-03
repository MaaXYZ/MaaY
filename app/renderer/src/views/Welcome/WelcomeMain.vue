<script setup lang="ts">
import { useTr } from '@/i18n'

const { t } = useTr()
</script>

<template>
  <div class="flex flex-col gap-2">
    <span class="font-bold text-xl"> MaaY </span>
    <span> {{ t('welcome.guide_panel') }} </span>
  </div>
</template>
