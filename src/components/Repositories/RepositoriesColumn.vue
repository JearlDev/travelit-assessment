<template>
  <div class="lg:col-span-1">
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-4 border-b">
        <h2 class="text-xl font-semibold text-gray-900">
          Repositories
          <span v-if="!loading" class="text-sm font-normal text-gray-500">
            ({{ repositories.length }})
          </span>
        </h2>
      </div>

      <!-- Loading Repositories -->
      <div v-if="loading" class="p-4">
        <div class="space-y-3">
          <div v-for="i in 5" :key="i" class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-100 rounded w-1/2 mt-2"></div>
          </div>
        </div>
      </div>

      <!-- Repositories List -->
      <div v-else class="sm:max-h-[600px] overflow-y-auto">
        <div
          v-for="repo in repositories"
          :key="repo.id"
          @click="$emit('selectRepository', repo)"
          class="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{
            'bg-blue-50 border-l-4 border-l-blue-500':
              selectedRepoId === repo.id,
            'border-b border-gray-200':
              repo.id !== repositories[repositories.length - 1]?.id,
          }"
        >
          <h3 class="font-medium text-blue-600 hover:text-blue-800">
            {{ repo.name }}
          </h3>
          <p class="text-sm text-gray-600 mt-1 line-clamp-2">
            {{ repo.description || "No description available" }}
          </p>
          <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span v-if="repo.language" class="flex items-center">
              <span class="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
              {{ repo.language }}
            </span>
            <span>⭐ {{ repo.stargazers_count }}</span>
            <span>🍴 {{ repo.forks_count }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!loading && repositories.length === 0"
        class="p-4 text-center text-gray-500"
      >
        <p>No repositories found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Repository } from "../../types";

interface Props {
  repositories: Repository[];
  loading: boolean;
  selectedRepoId?: number;
}

defineProps<Props>();

defineEmits<{
  selectRepository: [repo: Repository];
}>();
</script>
