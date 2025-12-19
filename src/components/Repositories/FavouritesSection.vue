<template>
  <div id="favourites-section" v-if="favourites.length > 0" class="mt-8">
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-4 border-b">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">
            Favourite Commits ({{ favourites.length }})
          </h2>
          <button
            @click="$emit('clearAll')"
            class="text-sm text-red-600 hover:text-red-800"
          >
            Clear All
          </button>
        </div>
      </div>
      <div class="sm:max-h-64 overflow-y-auto">
        <div
          v-for="favourite in favourites"
          :key="favourite.sha"
          class="p-4 bg-yellow-50"
          :class="{
            'border-b border-gray-200':
              favourite.sha !== favourites[favourites.length - 1]?.sha,
          }"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-medium text-gray-900 mb-1">
                {{ getCommitTitle(favourite.commit.message) }}
              </h3>
              <div class="text-sm text-gray-600 mb-1">
                <span class="font-medium">{{ favourite.repositoryName }}</span>
                • {{ favourite.commit.author.name }} •
                {{ formatDate(favourite.commit.author.date) }}
              </div>
              <div class="text-xs text-gray-500">
                Added to favourites {{ formatDate(favourite.addedAt) }}
              </div>
            </div>
            <button
              @click="$emit('removeFavourite', favourite.sha)"
              class="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition-colors ml-4"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { favouriteCommit } from "../../types";

interface Props {
  favourites: favouriteCommit[];
  formatDate: (dateString: string) => string;
  getCommitTitle: (message: string) => string;
}

defineProps<Props>();

defineEmits<{
  clearAll: [];
  removeFavourite: [sha: string];
}>();
</script>
