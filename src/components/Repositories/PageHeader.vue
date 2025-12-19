<template>
  <div class="flex justify-between items-start sm:items-center mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">
        {{ username }}'s Repositories
      </h1>
      <p class="text-gray-600 mt-1">
        {{ subtitle }}
      </p>
    </div>
    <button
      @click="$emit('goHome')"
      class="bg-gray-600 text-white px-4 py-2 whitespace-nowrap rounded-md hover:bg-gray-700 transition-colors"
    >
      ← Back to Home
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  username: string;
  subtitle?: string;
}

withDefaults(defineProps<Props>(), {
  subtitle: "Explore repositories and their commit history",
});

defineEmits<{
  goHome: [];
}>();
</script>
