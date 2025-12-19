import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGitHubStore } from "../stores/github";
import { apiUtils } from "../services/github";
import type { Repository, Commit, CommitSortOrder } from "../types";

export function useRepositoriesPage() {
  const route = useRoute();
  const router = useRouter();
  const githubStore = useGitHubStore();

  // Local state
  const selectedRepo = ref<Repository | null>(null);
  const selectedCommit = ref<Commit | null>(null);
  const showModal = ref(false);

  // Computed
  const username = computed(() => route.params.username as string);

  // Utility functions
  const formatDate = (dateString: string): string =>
    apiUtils.formatDate(dateString);
  const getCommitTitle = (message: string): string =>
    apiUtils.getCommitTitle(message);
  const getCommitBody = (message: string): string =>
    apiUtils.getCommitBody(message);
  const hasCommitBody = (message: string): boolean =>
    apiUtils.hasCommitBody(message);

  // Navigation
  const goHome = () => {
    router.push("/");
  };

  // Repository actions
  const loadRepositories = async () => {
    if (username.value) {
      await githubStore.fetchRepositories(username.value);
    }
  };

  const selectRepository = async (repo: Repository) => {
    const isDifferentRepo = selectedRepo.value?.id !== repo.id;
    selectedRepo.value = repo;

    if (username.value) {
      if (isDifferentRepo) {
        githubStore.commits = [];
        githubStore.commitsPagination.hasMore = false;
      }
      await githubStore.fetchCommits(username.value, repo.name);
    }
  };

  const loadMoreCommits = async () => {
    await githubStore.loadMoreCommits();
  };

  // Commits actions
  const handleSortOrderUpdate = (order: CommitSortOrder) => {
    githubStore.setSortOrder(order);
  };

  const toggleFavourite = (commit: Commit) => {
    if (githubStore.isfavourite(commit.sha)) {
      githubStore.removeFromfavourites(commit.sha);
    } else {
      githubStore.addTofavourites(commit);
    }
  };

  // Modal actions
  const viewCommitDetails = async (commit: Commit) => {
    selectedCommit.value = commit;
    showModal.value = true;

    if (username.value && selectedRepo.value) {
      await githubStore.fetchCommitDetails(
        username.value,
        selectedRepo.value.name,
        commit.sha
      );
    }
  };

  const closeModal = () => {
    showModal.value = false;
    selectedCommit.value = null;
    githubStore.resetCommitDetails();
  };

  // Favourites actions
  const handleClearAllFavourites = () => {
    githubStore.clearfavourites();
  };

  const handleRemoveFavourite = (sha: string) => {
    githubStore.removeFromfavourites(sha);
  };

  // Initialize
  onMounted(async () => {
    if (username.value) {
      await loadRepositories();
    }
  });

  return {
    // State
    selectedRepo,
    selectedCommit,
    showModal,
    username,

    // Store state (computed)
    repositories: computed(() => githubStore.repositories),
    repositoriesLoading: computed(() => githubStore.repositoriesLoading),
    repositoriesError: computed(() => githubStore.repositoriesError),
    commits: computed(() => githubStore.sortedCommits),
    commitsLoading: computed(() => githubStore.commitsLoading),
    commitsError: computed(() => githubStore.commitsError),
    commitSortOrder: computed(() => githubStore.commitSortOrder),
    commitsPagination: computed(() => githubStore.commitsPagination),
    favouriteCommits: computed(() => githubStore.favouriteCommits),
    commitDetails: computed(() => githubStore.commitDetails),
    commitDetailsLoading: computed(() => githubStore.commitDetailsLoading),
    commitDetailsError: computed(() => githubStore.commitDetailsError),

    // Utility functions
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

    // Store functions
    isFavourite: githubStore.isfavourite,
  };
}
