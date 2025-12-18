<template>
  <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-4xl font-bold text-center mb-6">Home Page</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label
          for="username"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          GitHub Username
        </label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Enter GitHub username"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.username }"
        />
        <p v-if="errors.username" class="text-red-500 text-sm mt-1">
          {{ errors.username }}
        </p>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">Fetching Repositories...</span>
        <span v-else>Fetch Repositories</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const isLoading = ref(false);

const errors = reactive({
  username: "",
});

const validateForm = (): boolean => {
  errors.username = "";

  if (!username.value.trim()) {
    errors.username = "Username is required";
    return false;
  }

  if (username.value.trim().length < 3) {
    errors.username = "Username must be at least 3 characters long";
    return false;
  }

  // GitHub username validation pattern
  const githubUsernamePattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  if (!githubUsernamePattern.test(username.value.trim())) {
    errors.username = "Invalid GitHub username format";
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    // Navigate to repositories page with username as a parameter
    await router.push({
      name: "Repositories",
      params: { username: username.value.trim() },
    });
  } catch (error) {
    console.error("Navigation error:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
