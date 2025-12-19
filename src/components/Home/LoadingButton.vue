<template>
  <button
    type="submit"
    :disabled="disabled"
    :class="buttonClasses"
    @click="$emit('click')"
  >
    <span v-if="loading" class="flex items-center justify-center">
      <svg
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {{ loadingText }}
    </span>
    <span v-else>{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  loading?: boolean;
  disabled?: boolean;
  text: string;
  loadingText?: string;
  variant?: "primary" | "secondary";
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  loadingText: "Loading...",
  variant: "primary",
});

defineEmits<{
  click: [];
}>();

const buttonClasses = computed(() => [
  "w-full mt-6 py-3 px-4 rounded-md font-medium transition-colors",
  "focus:outline-none focus:ring-2 focus:ring-offset-2",
  "disabled:opacity-50 disabled:cursor-not-allowed",
  props.variant === "primary"
    ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
    : "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
]);
</script>
