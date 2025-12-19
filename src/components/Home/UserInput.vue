<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <input
      :id="id"
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      :class="{ 'border-red-500 focus:ring-red-500': hasError }"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  id: string;
  modelValue: string;
  label: string;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
}

const props = defineProps<Props>();
defineEmits<{
  "update:modelValue": [value: string];
}>();

const hasError = computed(() => Boolean(props.errorMessage));
</script>
