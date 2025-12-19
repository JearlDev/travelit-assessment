<template>
  <div
    v-if="message"
    class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
    role="alert"
  >
    <p v-if="title" class="font-medium">{{ title }}</p>
    <p class="text-sm" :class="{ 'mt-1': title }">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  message: string;
}

defineProps<Props>();
</script>
