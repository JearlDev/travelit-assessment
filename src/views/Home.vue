<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Page Header -->
      <PageHeader
        title="GitHub Commit Explorer"
        subtitle="Explore GitHub repositories and their commits"
      />

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <UserInput
            id="username"
            v-model="username"
            label="GitHub Username"
            placeholder="Enter GitHub username (e.g., octocat)"
            :error-message="errors.username"
            :disabled="isLoading"
            @input="clearErrors"
          />

          <LoadingButton
            :loading="isLoading"
            :disabled="isLoading || !isFormValid"
            text="Explore Repositories"
            loading-text="Fetching Repositories..."
            @click="handleSubmit"
          />
        </div>
      </form>

      <!-- Error display -->
      <ErrorAlert title="Error" :message="globalError" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from "../components/Home/PageHeader.vue";
import UserInput from "../components/Home/UserInput.vue";
import LoadingButton from "../components/Home/LoadingButton.vue";
import ErrorAlert from "../components/Home/ErrorAlert.vue";
import { useUserForm } from "../composables/useUserForm";

const {
  username,
  isLoading,
  globalError,
  errors,
  handleSubmit,
  isFormValid,
  clearErrors,
} = useUserForm();
</script>
