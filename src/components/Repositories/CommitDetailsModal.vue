<template>
  <div
    v-if="show && commit"
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    @click="$emit('close')"
  >
    <div
      class="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-hidden w-full"
      @click.stop
    >
      <div class="flex justify-between items-center p-6 border-b">
        <h3 class="text-xl font-semibold">Commit Details</h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div class="overflow-y-auto max-h-[calc(90vh-120px)]">
        <div v-if="loading" class="p-8 text-center">
          <div
            class="animate-spin w-8 h-8 border-b-2 border-blue-500 rounded-full mx-auto"
          ></div>
          <p class="mt-4 text-gray-600">Loading commit details...</p>
        </div>

        <div v-else-if="error" class="p-6 bg-red-50 text-red-700">
          <p class="font-medium">Error loading commit details</p>
          <p class="text-sm mt-1">{{ error }}</p>
        </div>

        <div v-else-if="details" class="p-6">
          <!-- Commit Info -->
          <div class="mb-6">
            <h4 class="font-medium text-lg mb-2">
              {{ getCommitTitle(details.commit.message) }}
            </h4>
            <div
              v-if="hasCommitBody(details.commit.message)"
              class="text-gray-600 mb-4 whitespace-pre-wrap"
            >
              {{ getCommitBody(details.commit.message) }}
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <img
                  v-if="details.author?.avatar_url"
                  :src="details.author.avatar_url"
                  :alt="details.commit.author.name"
                  class="w-5 h-5 rounded-full"
                />
                <span>{{ details.commit.author.name }}</span>
              </div>
              <span>{{ formatDate(details.commit.author.date) }}</span>
              <span class="font-mono bg-gray-100 px-2 py-1 rounded">
                {{ details.sha.substring(0, 12) }}
              </span>
            </div>
          </div>

          <!-- Statistics -->
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h5 class="font-medium mb-3">Statistics</h5>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-green-600">
                  +{{ details.stats.additions }}
                </div>
                <div class="text-sm text-gray-600">Additions</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-red-600">
                  -{{ details.stats.deletions }}
                </div>
                <div class="text-sm text-gray-600">Deletions</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-blue-600">
                  {{ details.files?.length || 0 }}
                </div>
                <div class="text-sm text-gray-600">Files Changed</div>
              </div>
            </div>
          </div>

          <!-- Files Changed -->
          <div v-if="details.files && details.files.length > 0">
            <h5 class="font-medium mb-4">
              Files Changed ({{ details.files.length }})
            </h5>
            <div class="space-y-4">
              <div
                v-for="file in details.files"
                :key="file.filename"
                class="border rounded-lg overflow-hidden"
              >
                <div
                  class="bg-gray-50 px-4 py-3 border-b flex justify-between items-center"
                >
                  <div class="flex items-center gap-3">
                    <span class="font-medium text-sm font-mono">{{
                      file.filename
                    }}</span>
                    <span
                      class="px-2 py-1 rounded text-xs text-white"
                      :class="{
                        'bg-green-500': file.status === 'added',
                        'bg-blue-500': file.status === 'modified',
                        'bg-red-500': file.status === 'removed',
                        'bg-purple-500': file.status === 'renamed',
                      }"
                    >
                      {{ file.status }}
                    </span>
                  </div>
                  <div class="text-sm space-x-3">
                    <span class="text-green-600">+{{ file.additions }}</span>
                    <span class="text-red-600">-{{ file.deletions }}</span>
                  </div>
                </div>
                <div
                  v-if="file.patch"
                  class="p-4 bg-gray-800 text-gray-100 text-sm overflow-x-auto"
                >
                  <pre class="whitespace-pre-wrap">{{ file.patch }}</pre>
                </div>
                <div v-else class="p-4 text-center text-gray-500 text-sm">
                  <p>Binary file or no changes to display</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Commit, CommitDetail } from "../../types";

interface Props {
  show: boolean;
  commit: Commit | null;
  details: CommitDetail | null;
  loading: boolean;
  error: string | null;
  formatDate: (dateString: string) => string;
  getCommitTitle: (message: string) => string;
  getCommitBody: (message: string) => string;
  hasCommitBody: (message: string) => boolean;
}

defineProps<Props>();

defineEmits<{
  close: [];
}>();
</script>
