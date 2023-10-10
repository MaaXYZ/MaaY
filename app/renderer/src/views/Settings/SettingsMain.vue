<script setup lang="ts">
import { registerRecv } from '@/sync'

const test = registerRecv('test', '333')
const deep = registerRecv('deep', { value: '' })
</script>

<template>
  <div>{{ deep.value }}</div>
</template>
