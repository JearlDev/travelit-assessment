<template>
  <div class="lg:col-span-3">
    <div v-if="selectedRepo" class="space-y-6">
      <!-- Commit Controls -->
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">
            Commits for {{ selectedRepo.name }}
            <span
              v-if="!commitsLoading"
              class="text-sm font-normal text-gray-500"
            >
              ({{ commits.length }})
            </span>
          </h2>
          <div class="flex items-center gap-4">
            <select
              :value="commitSortOrder"
              @change="
                $emit(
                  'updateSortOrder',
                  ($event.target as HTMLSelectElement).value as CommitSortOrder
                )
              "
              class="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Commits Error -->
      <div
        v-if="commitsError"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
      >
        <p class="font-medium">Error loading commits</p>
        <p class="text-sm mt-1">{{ commitsError }}</p>
      </div>

      <!-- Loading Commits -->
      <div
        v-if="commitsLoading && commits.length === 0"
        class="bg-white rounded-lg shadow-md p-4"
      >
        <div class="space-y-4">
          <div
            v-for="i in 8"
            :key="i"
            class="animate-pulse pb-4"
            :class="{
              'border-b border-gray-200': i !== 8,
            }"
          >
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Commits List -->
      <div v-else-if="commits.length > 0" class="bg-white rounded-lg shadow-md">
        <div class="sm:max-h-[600px] overflow-y-auto">
          <div
            v-for="commit in commits"
            :key="commit.sha"
            class="p-4 hover:bg-gray-50"
            :class="{
              'bg-yellow-50': isFavorite(commit.sha),
              'border-b border-gray-200':
                commit.sha !== commits[commits.length - 1]?.sha,
            }"
          >
            <div class="flex justify-between items-start gap-4">
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-900 mb-1">
                  {{ getCommitTitle(commit.commit.message) }}
                </h3>
                <div
                  class="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-600 mb-2"
                >
                  <span class="flex items-center gap-1">
                    <img
                      v-if="commit.author?.avatar_url"
                      :src="commit.author.avatar_url"
                      :alt="commit.commit.author.name"
                      class="w-4 h-4 rounded-full"
                    />
                    {{ commit.commit.author.name }}
                  </span>
                  <span>{{ formatDate(commit.commit.author.date) }}</span>
                  <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {{ commit.sha.substring(0, 7) }}
                  </span>
                </div>
                <p
                  v-if="hasCommitBody(commit.commit.message)"
                  class="text-sm text-gray-600 line-clamp-2"
                >
                  {{ getCommitBody(commit.commit.message) }}
                </p>
              </div>

              <div class="flex flex-col gap-2">
                <button
                  @click="$emit('toggleFavorite', commit)"
                  class="text-sm px-3 py-1 rounded transition-colors"
                  :class="
                    isFavorite(commit.sha)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  "
                >
                  {{ isFavorite(commit.sha) ? "💔 Remove" : "💖 favourite" }}
                </button>
                <button
                  @click="$emit('viewDetails', commit)"
                  class="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  📄 Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMore" class="p-4 border-t text-center">
          <button
            @click="$emit('loadMore')"
            :disabled="commitsLoading"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            <span v-if="commitsLoading">Loading...</span>
            <span v-else>Load More Commits</span>
          </button>
        </div>
      </div>

      <!-- No Commits -->
      <div
        v-else-if="!commitsLoading"
        class="bg-white rounded-lg shadow-md p-8 text-center text-gray-500"
      >
        <p>No commits found for this repository</p>
      </div>
    </div>

    <!-- No Repository Selected -->
    <div
      v-else
      class="bg-white rounded-lg shadow-md p-8 text-center text-gray-500"
    >
      <div class="max-w-md mx-auto">
        <div
          class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Select a Repository
        </h3>
        <p>Choose a repository from the list to view its commits and details</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Repository, Commit, CommitSortOrder } from "../../types";

interface Props {
  selectedRepo: Repository | null;
  commits: Commit[];
  commitsLoading: boolean;
  commitsError: string | null;
  commitSortOrder: CommitSortOrder;
  hasMore: boolean;
  isFavorite: (sha: string) => boolean;
  formatDate: (dateString: string) => string;
  getCommitTitle: (message: string) => string;
  getCommitBody: (message: string) => string;
  hasCommitBody: (message: string) => boolean;
}

defineProps<Props>();

defineEmits<{
  updateSortOrder: [order: CommitSortOrder];
  toggleFavorite: [commit: Commit];
  viewDetails: [commit: Commit];
  loadMore: [];
}>();
</script>
