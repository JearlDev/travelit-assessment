<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header -->
      <PageHeader :username="username" @go-home="goHome" />

      <!-- Error State -->
      <ErrorAlert
        v-if="repositoriesError"
        title="Error loading repositories"
        :message="repositoriesError"
        @retry="loadRepositories"
      />

      <!-- Main Content -->
      <div class="grid gap-8 lg:grid-cols-4">
        <!-- Repositories Column -->
        <RepositoriesColumn
          :repositories="repositories"
          :loading="repositoriesLoading"
          :selected-repo-id="selectedRepo?.id"
          @select-repository="selectRepository"
        />

        <!-- Commits and Details Column -->
        <CommitsColumn
          :selected-repo="selectedRepo"
          :commits="commits"
          :commits-loading="commitsLoading"
          :commits-error="commitsError"
          :commit-sort-order="commitSortOrder"
          :has-more="commitsPagination.hasMore"
          :is-favorite="isFavourite"
          :format-date="formatDate"
          :get-commit-title="getCommitTitle"
          :get-commit-body="getCommitBody"
          :has-commit-body="hasCommitBody"
          @update-sort-order="handleSortOrderUpdate"
          @toggle-favorite="toggleFavourite"
          @view-details="viewCommitDetails"
          @load-more="loadMoreCommits"
        />
      </div>

      <!-- Favourites Section -->
      <FavouritesSection
        :favourites="favouriteCommits"
        :format-date="formatDate"
        :get-commit-title="getCommitTitle"
        @clear-all="handleClearAllFavourites"
        @remove-favourite="handleRemoveFavourite"
      />
    </div>

    <!-- Commit Details Modal -->
    <CommitDetailsModal
      :show="showModal"
      :commit="selectedCommit"
      :details="commitDetails"
      :loading="commitDetailsLoading"
      :error="commitDetailsError"
      :format-date="formatDate"
      :get-commit-title="getCommitTitle"
      :get-commit-body="getCommitBody"
      :has-commit-body="hasCommitBody"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from "../components/Repositories/PageHeader.vue";
import ErrorAlert from "../components/Repositories/ErrorAlert.vue";
import RepositoriesColumn from "../components/Repositories/RepositoriesColumn.vue";
import CommitsColumn from "../components/Repositories/CommitsColumn.vue";
import FavouritesSection from "../components/Repositories/FavouritesSection.vue";
import CommitDetailsModal from "../components/Repositories/CommitDetailsModal.vue";
import { useRepositoriesPage } from "../composables/useRepositoriesPage";

const {
  // State
  selectedRepo,
  selectedCommit,
  showModal,
  username,
  repositories,
  repositoriesLoading,
  repositoriesError,
  commits,
  commitsLoading,
  commitsError,
  commitSortOrder,
  commitsPagination,
  favouriteCommits,
  commitDetails,
  commitDetailsLoading,
  commitDetailsError,
  // Utilities
  formatDate,
  getCommitTitle,
  getCommitBody,
  hasCommitBody,
  // Actions
  goHome,
  loadRepositories,
  selectRepository,
  loadMoreCommits,
  handleSortOrderUpdate,
  toggleFavourite,
  viewCommitDetails,
  closeModal,
  handleClearAllFavourites,
  handleRemoveFavourite,
  isFavourite,
} = useRepositoriesPage();
</script>
