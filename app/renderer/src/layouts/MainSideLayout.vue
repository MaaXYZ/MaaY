<script setup lang="ts">
import NavigateGroup from '@/components/NavigateGroup.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="w-screen h-screen flex gap-2">
    <div class="w-64 bg-gray-100 p-2">
      <RouterView name="Side"></RouterView>
    </div>
    <div class="flex-1 flex flex-col gap-1 p-2">
      <div class="flex justify-end">
        <NavigateGroup></NavigateGroup>
      </div>
      <RouterView name="Main" v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component"></component>
        </KeepAlive>
      </RouterView>
    </div>
  </div>
</template>
