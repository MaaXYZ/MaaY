<script setup lang="ts">
withDefaults(
  defineProps<{
    left?: number
    right?: number
  }>(),
  {
    left: 1,
    right: 6
  }
)
</script>

<template>
  <div class="grid items-center gap-2" :style="`grid-template-columns: ${left}fr ${right}fr`">
    <slot></slot>
  </div>
</template>
