<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold text-gray-900 mb-2">
      {{ title }}
    </h1>
    <p v-if="subtitle" class="text-gray-600">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
}

defineProps<Props>();
</script>
