<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="w-screen h-screen flex gap-2">
    <div class="w-64">
      <RouterView name="Side"></RouterView>
    </div>
    <div class="flex-1">
      <RouterView name="Main"></RouterView>
    </div>
  </div>
</template>
