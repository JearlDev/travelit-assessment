import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { githubApi, GitHubApiError } from "../services/github";
import type {
  Repository,
  Commit,
  CommitDetail,
  favouriteCommit,
  PaginationMeta,
  CommitSortOrder,
} from "../types";

// Main store for GitHub repository and commit data
export const useGitHubStore = defineStore("github", () => {
  // Repositories state
  const repositories = ref<Repository[]>([]);
  const repositoriesLoading = ref(false);
  const repositoriesError = ref<string | null>(null);
  const currentUser = ref<string | null>(null);

  // Commits state
  const commits = ref<Commit[]>([]);
  const commitsLoading = ref(false);
  const commitsError = ref<string | null>(null);
  const currentRepository = ref<string | null>(null);
  const commitsPagination = ref<PaginationMeta>({
    page: 1,
    perPage: 30,
    hasMore: false,
  });

  // Commit details state
  const commitDetails = ref<CommitDetail | null>(null);
  const commitDetailsLoading = ref(false);
  const commitDetailsError = ref<string | null>(null);

  // favourites state
  const favouriteCommits = ref<favouriteCommit[]>([]);

  // Sorting state
  const commitSortOrder = ref<CommitSortOrder>("newest");

  // Computed values
  const sortedCommits = computed(() => {
    const commitsCopy = [...commits.value];
    return commitsCopy.sort((a, b) => {
      const dateA = new Date(a.commit.author.date).getTime();
      const dateB = new Date(b.commit.author.date).getTime();
      return commitSortOrder.value === "newest" ? dateB - dateA : dateA - dateB;
    });
  });

  const favouriteCommitShas = computed(() =>
    favouriteCommits.value.map((fav) => fav.sha)
  );

  // Actions for repositories
  const fetchRepositories = async (
    username: string,
    page = 1
  ): Promise<void> => {
    try {
      repositoriesLoading.value = true;
      repositoriesError.value = null;
      currentUser.value = username;

      const { repositories: fetchedRepos } =
        await githubApi.getUserRepositories(username, page);

      if (page === 1) {
        repositories.value = fetchedRepos;
      } else {
        repositories.value.push(...fetchedRepos);
      }
    } catch (error) {
      if (error instanceof GitHubApiError) {
        repositoriesError.value = error.message;
      } else {
        repositoriesError.value =
          "An unexpected error occurred while fetching repositories";
      }
      console.error("Error fetching repositories:", error);
    } finally {
      repositoriesLoading.value = false;
    }
  };

  // Actions for commits
  const fetchCommits = async (
    username: string,
    repository: string,
    page = 1
  ): Promise<void> => {
    try {
      commitsLoading.value = true;
      commitsError.value = null;
      currentRepository.value = repository;

      const { commits: fetchedCommits, pagination } =
        await githubApi.getRepositoryCommits(username, repository, page);

      if (page === 1) {
        commits.value = fetchedCommits;
      } else {
        commits.value.push(...fetchedCommits);
      }

      if (pagination) {
        commitsPagination.value = pagination;
      }
    } catch (error) {
      if (error instanceof GitHubApiError) {
        commitsError.value = error.message;
      } else {
        commitsError.value =
          "An unexpected error occurred while fetching commits";
      }
      console.error("Error fetching commits:", error);
    } finally {
      commitsLoading.value = false;
    }
  };

  const loadMoreCommits = async (): Promise<void> => {
    if (
      !currentUser.value ||
      !currentRepository.value ||
      !commitsPagination.value.hasMore
    ) {
      return;
    }

    await fetchCommits(
      currentUser.value,
      currentRepository.value,
      commitsPagination.value.page + 1
    );
  };

  // Actions for commit details
  const fetchCommitDetails = async (
    username: string,
    repository: string,
    sha: string
  ): Promise<void> => {
    try {
      commitDetailsLoading.value = true;
      commitDetailsError.value = null;

      const details = await githubApi.getCommitDetails(
        username,
        repository,
        sha
      );
      commitDetails.value = details;
    } catch (error) {
      if (error instanceof GitHubApiError) {
        commitDetailsError.value = error.message;
      } else {
        commitDetailsError.value =
          "An unexpected error occurred while fetching commit details";
      }
      console.error("Error fetching commit details:", error);
    } finally {
      commitDetailsLoading.value = false;
    }
  };

  // Actions for favourites
  const addTofavourites = (commit: Commit): void => {
    if (!currentUser.value || !currentRepository.value) {
      console.warn(
        "Cannot add to favourites: missing user or repository context"
      );
      return;
    }

    // Check if already in favourites
    if (favouriteCommitShas.value.includes(commit.sha)) {
      return;
    }

    const favouriteCommit: favouriteCommit = {
      sha: commit.sha,
      repositoryName: currentRepository.value,
      username: currentUser.value,
      commit: commit.commit,
      author: commit.author,
      html_url: commit.html_url,
      addedAt: new Date().toISOString(),
    };

    favouriteCommits.value.push(favouriteCommit);

    // Persist to localStorage
    savefavouritesToStorage();
  };

  const removeFromfavourites = (sha: string): void => {
    const index = favouriteCommits.value.findIndex((fav) => fav.sha === sha);
    if (index !== -1) {
      favouriteCommits.value.splice(index, 1);
      savefavouritesToStorage();
    }
  };

  const isfavourite = (sha: string): boolean => {
    return favouriteCommitShas.value.includes(sha);
  };

  const clearfavourites = (): void => {
    favouriteCommits.value = [];
    savefavouritesToStorage();
  };

  // Persistence helpers
  const savefavouritesToStorage = (): void => {
    try {
      localStorage.setItem(
        "github-explorer-favourites",
        JSON.stringify(favouriteCommits.value)
      );
    } catch (error) {
      console.warn("Failed to save favourites to localStorage:", error);
    }
  };

  const loadfavouritesFromStorage = (): void => {
    try {
      const stored = localStorage.getItem("github-explorer-favourites");
      if (stored) {
        const parsed = JSON.parse(stored) as favouriteCommit[];
        favouriteCommits.value = parsed;
      }
    } catch (error) {
      console.warn("Failed to load favourites from localStorage:", error);
      favouriteCommits.value = [];
    }
  };

  // Sorting actions
  const setSortOrder = (order: CommitSortOrder): void => {
    commitSortOrder.value = order;
  };

  // Reset actions
  const resetRepositories = (): void => {
    repositories.value = [];
    repositoriesError.value = null;
    currentUser.value = null;
  };

  const resetCommits = (): void => {
    commits.value = [];
    commitsError.value = null;
    currentRepository.value = null;
    commitsPagination.value = {
      page: 1,
      perPage: 30,
      hasMore: false,
    };
  };

  const resetCommitDetails = (): void => {
    commitDetails.value = null;
    commitDetailsError.value = null;
  };

  const resetAll = (): void => {
    resetRepositories();
    resetCommits();
    resetCommitDetails();
  };

  // Initialize favourites from storage
  loadfavouritesFromStorage();

  return {
    // State
    repositories,
    repositoriesLoading,
    repositoriesError,
    currentUser,

    commits,
    commitsLoading,
    commitsError,
    currentRepository,
    commitsPagination,

    commitDetails,
    commitDetailsLoading,
    commitDetailsError,

    favouriteCommits,
    commitSortOrder,

    // Computed
    sortedCommits,
    favouriteCommitShas,

    // Actions
    fetchRepositories,
    fetchCommits,
    loadMoreCommits,
    fetchCommitDetails,
    addTofavourites,
    removeFromfavourites,
    isfavourite,
    clearfavourites,
    setSortOrder,
    resetRepositories,
    resetCommits,
    resetCommitDetails,
    resetAll,
  };
});
