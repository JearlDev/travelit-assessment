<template>
  <div
    v-if="message"
    class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6"
    role="alert"
  >
    <p class="font-medium">{{ title }}</p>
    <p class="text-sm mt-1">{{ message }}</p>
    <button
      v-if="showRetry"
      @click="$emit('retry')"
      class="mt-2 text-sm underline hover:no-underline"
    >
      {{ retryText }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  message: string;
  showRetry?: boolean;
  retryText?: string;
}

withDefaults(defineProps<Props>(), {
  showRetry: true,
  retryText: "Try again",
});

defineEmits<{
  retry: [];
}>();
</script>
