import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGitHubStore } from "../stores/github";
import { githubApi, GitHubApiError } from "../services/github";
import type { Repository, Commit, CommitDetail } from "../types";

// Mock the GitHub API
vi.mock("../services/github", () => ({
  githubApi: {
    getUserRepositories: vi.fn(),
    getRepositoryCommits: vi.fn(),
    getCommitDetails: vi.fn(),
    validateUser: vi.fn(),
  },
  GitHubApiError: class extends Error {
    public status: number;
    constructor(message: string, status: number) {
      super(message);
      this.name = "GitHubApiError";
      this.status = status;
    }
  },
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(globalThis, "localStorage", {
  value: mockLocalStorage,
});

describe("GitHub Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe("Repository Management", () => {
    it("should fetch repositories successfully", async () => {
      const mockRepos: Repository[] = [
        {
          id: 1,
          name: "test-repo",
          full_name: "user/test-repo",
          description: "Test repository",
          html_url: "https://github.com/user/test-repo",
          created_at: "2023-01-01",
          updated_at: "2023-01-02",
          pushed_at: "2023-01-02",
          stargazers_count: 5,
          forks_count: 2,
          language: "TypeScript",
          private: false,
        },
      ];

      vi.mocked(githubApi.getUserRepositories).mockResolvedValue({
        repositories: mockRepos,
      });

      const store = useGitHubStore();
      await store.fetchRepositories("testuser");

      expect(store.repositories).toEqual(mockRepos);
      expect(store.currentUser).toBe("testuser");
      expect(store.repositoriesLoading).toBe(false);
      expect(store.repositoriesError).toBe(null);
    });

    it("should handle repository fetch errors", async () => {
      const error = new GitHubApiError("User not found", 404);
      vi.mocked(githubApi.getUserRepositories).mockRejectedValue(error);

      const store = useGitHubStore();
      await store.fetchRepositories("nonexistentuser");

      expect(store.repositories).toEqual([]);
      expect(store.repositoriesLoading).toBe(false);
      expect(store.repositoriesError).toBe("User not found");
    });

    it("should reset repositories state", () => {
      const store = useGitHubStore();

      // Set some state
      store.repositories.push({
        id: 1,
        name: "test",
        full_name: "user/test",
        description: null,
        html_url: "https://github.com/user/test",
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
        pushed_at: "2023-01-01",
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        private: false,
      });
      store.currentUser = "testuser";
      store.repositoriesError = "Some error";

      store.resetRepositories();

      expect(store.repositories).toEqual([]);
      expect(store.currentUser).toBe(null);
      expect(store.repositoriesError).toBe(null);
    });
  });

  describe("Commit Management", () => {
    it("should fetch commits successfully", async () => {
      const mockCommits: Commit[] = [
        {
          sha: "abc123",
          node_id: "node123",
          url: "https://api.github.com/repos/user/repo/commits/abc123",
          html_url: "https://github.com/user/repo/commit/abc123",
          commit: {
            message: "Initial commit",
            author: {
              name: "Test User",
              email: "test@example.com",
              date: "2023-01-01T00:00:00Z",
            },
            committer: {
              name: "Test User",
              email: "test@example.com",
              date: "2023-01-01T00:00:00Z",
            },
            tree: {
              sha: "tree123",
              url: "https://api.github.com/repos/user/repo/git/trees/tree123",
            },
          },
          author: {
            login: "testuser",
            id: 1,
            avatar_url: "https://github.com/images/error/testuser_happy.gif",
            html_url: "https://github.com/testuser",
          },
          committer: {
            login: "testuser",
            id: 1,
            avatar_url: "https://github.com/images/error/testuser_happy.gif",
            html_url: "https://github.com/testuser",
          },
        },
      ];

      vi.mocked(githubApi.getRepositoryCommits).mockResolvedValue({
        commits: mockCommits,
        pagination: { page: 1, perPage: 30, hasMore: false },
      });

      const store = useGitHubStore();
      await store.fetchCommits("testuser", "test-repo");

      expect(store.commits).toEqual(mockCommits);
      expect(store.currentRepository).toBe("test-repo");
      expect(store.commitsLoading).toBe(false);
      expect(store.commitsError).toBe(null);
    });

    it("should handle commit fetch errors", async () => {
      const error = new GitHubApiError("Repository not found", 404);
      vi.mocked(githubApi.getRepositoryCommits).mockRejectedValue(error);

      const store = useGitHubStore();
      await store.fetchCommits("testuser", "nonexistent-repo");

      expect(store.commits).toEqual([]);
      expect(store.commitsLoading).toBe(false);
      expect(store.commitsError).toBe("Repository not found");
    });

    it("should sort commits by date", () => {
      const store = useGitHubStore();

      const commit1: Commit = {
        sha: "abc123",
        node_id: "node123",
        url: "https://api.github.com/repos/user/repo/commits/abc123",
        html_url: "https://github.com/user/repo/commit/abc123",
        commit: {
          message: "Older commit",
          author: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-01T00:00:00Z",
          },
          committer: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-01T00:00:00Z",
          },
          tree: {
            sha: "tree123",
            url: "https://api.github.com/repos/user/repo/git/trees/tree123",
          },
        },
        author: null,
        committer: null,
      };

      const commit2: Commit = {
        sha: "def456",
        node_id: "node456",
        url: "https://api.github.com/repos/user/repo/commits/def456",
        html_url: "https://github.com/user/repo/commit/def456",
        commit: {
          message: "Newer commit",
          author: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-02T00:00:00Z",
          },
          committer: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-02T00:00:00Z",
          },
          tree: {
            sha: "tree456",
            url: "https://api.github.com/repos/user/repo/git/trees/tree456",
          },
        },
        author: null,
        committer: null,
      };

      store.commits = [commit1, commit2];

      // Test newest first (default)
      expect(store.sortedCommits[0]?.sha).toBe("def456");
      expect(store.sortedCommits[1]?.sha).toBe("abc123");

      // Test oldest first
      store.setSortOrder("oldest");
      expect(store.sortedCommits[0]?.sha).toBe("abc123");
      expect(store.sortedCommits[1]?.sha).toBe("def456");
    });
  });

  describe("favourites Management", () => {
    it("should add commit to favourites", () => {
      const store = useGitHubStore();
      store.currentUser = "testuser";
      store.currentRepository = "test-repo";

      const commit: Commit = {
        sha: "abc123",
        node_id: "node123",
        url: "https://api.github.com/repos/user/repo/commits/abc123",
        html_url: "https://github.com/user/repo/commit/abc123",
        commit: {
          message: "Test commit",
          author: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-01T00:00:00Z",
          },
          committer: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-01T00:00:00Z",
          },
          tree: {
            sha: "tree123",
            url: "https://api.github.com/repos/user/repo/git/trees/tree123",
          },
        },
        author: {
          login: "testuser",
          id: 1,
          avatar_url: "https://github.com/images/error/testuser_happy.gif",
          html_url: "https://github.com/testuser",
        },
        committer: null,
      };

      store.addTofavourites(commit);

      expect(store.favouriteCommits).toHaveLength(1);
      expect(store.favouriteCommits[0]?.sha).toBe("abc123");
      expect(store.isfavourite("abc123")).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it("should remove commit from favourites", () => {
      const store = useGitHubStore();
      store.currentUser = "testuser";
      store.currentRepository = "test-repo";

      const commit: Commit = {
        sha: "abc123",
        node_id: "node123",
        url: "https://api.github.com/repos/user/repo/commits/abc123",
        html_url: "https://github.com/user/repo/commit/abc123",
        commit: {
          message: "Test commit",
          author: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-01T00:00:00Z",
          },
          committer: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-01T00:00:00Z",
          },
          tree: {
            sha: "tree123",
            url: "https://api.github.com/repos/user/repo/git/trees/tree123",
          },
        },
        author: {
          login: "testuser",
          id: 1,
          avatar_url: "https://github.com/images/error/testuser_happy.gif",
          html_url: "https://github.com/testuser",
        },
        committer: null,
      };

      // Add then remove
      store.addTofavourites(commit);
      expect(store.favouriteCommits).toHaveLength(1);

      store.removeFromfavourites("abc123");
      expect(store.favouriteCommits).toHaveLength(0);
      expect(store.isfavourite("abc123")).toBe(false);
    });

    it("should not add duplicate favourites", () => {
      const store = useGitHubStore();
      store.currentUser = "testuser";
      store.currentRepository = "test-repo";

      const commit: Commit = {
        sha: "abc123",
        node_id: "node123",
        url: "https://api.github.com/repos/user/repo/commits/abc123",
        html_url: "https://github.com/user/repo/commit/abc123",
        commit: {
          message: "Test commit",
          author: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-01T00:00:00Z",
          },
          committer: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-01T00:00:00Z",
          },
          tree: {
            sha: "tree123",
            url: "https://api.github.com/repos/user/repo/git/trees/tree123",
          },
        },
        author: null,
        committer: null,
      };

      store.addTofavourites(commit);
      store.addTofavourites(commit);

      expect(store.favouriteCommits).toHaveLength(1);
    });

    it("should clear all favourites", () => {
      const store = useGitHubStore();
      store.currentUser = "testuser";
      store.currentRepository = "test-repo";

      // Add some favourites
      const commit1: Commit = {
        sha: "abc123",
        node_id: "node123",
        url: "https://api.github.com/repos/user/repo/commits/abc123",
        html_url: "https://github.com/user/repo/commit/abc123",
        commit: {
          message: "Test commit 1",
          author: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-01T00:00:00Z",
          },
          committer: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-01T00:00:00Z",
          },
          tree: {
            sha: "tree123",
            url: "https://api.github.com/repos/user/repo/git/trees/tree123",
          },
        },
        author: null,
        committer: null,
      };

      const commit2: Commit = {
        sha: "def456",
        node_id: "node456",
        url: "https://api.github.com/repos/user/repo/commits/def456",
        html_url: "https://github.com/user/repo/commit/def456",
        commit: {
          message: "Test commit 2",
          author: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-02T00:00:00Z",
          },
          committer: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-02T00:00:00Z",
          },
          tree: {
            sha: "tree456",
            url: "https://api.github.com/repos/user/repo/git/trees/tree456",
          },
        },
        author: null,
        committer: null,
      };

      store.addTofavourites(commit1);
      store.addTofavourites(commit2);
      expect(store.favouriteCommits).toHaveLength(2);

      store.clearfavourites();
      expect(store.favouriteCommits).toHaveLength(0);
    });
  });

  describe("Commit Details", () => {
    it("should fetch commit details successfully", async () => {
      const mockCommitDetails: CommitDetail = {
        sha: "abc123",
        node_id: "node123",
        url: "https://api.github.com/repos/user/repo/commits/abc123",
        html_url: "https://github.com/user/repo/commit/abc123",
        commit: {
          message: "Test commit with details",
          author: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-01T00:00:00Z",
          },
          committer: {
            name: "Test User",
            email: "test@example.com",
            date: "2023-01-01T00:00:00Z",
          },
          tree: {
            sha: "tree123",
            url: "https://api.github.com/repos/user/repo/git/trees/tree123",
          },
        },
        author: null,
        committer: null,
        files: [
          {
            sha: "file123",
            filename: "test.ts",
            status: "modified",
            additions: 10,
            deletions: 5,
            changes: 15,
            blob_url: "https://github.com/user/repo/blob/abc123/test.ts",
            raw_url: "https://github.com/user/repo/raw/abc123/test.ts",
            contents_url:
              "https://api.github.com/repos/user/repo/contents/test.ts?ref=abc123",
            patch: "@@ -1,3 +1,3 @@\n-old line\n+new line",
          },
        ],
        stats: {
          total: 15,
          additions: 10,
          deletions: 5,
        },
        parents: [],
      };

      vi.mocked(githubApi.getCommitDetails).mockResolvedValue(
        mockCommitDetails
      );

      const store = useGitHubStore();
      await store.fetchCommitDetails("testuser", "test-repo", "abc123");

      expect(store.commitDetails).toEqual(mockCommitDetails);
      expect(store.commitDetailsLoading).toBe(false);
      expect(store.commitDetailsError).toBe(null);
    });

    it("should handle commit details fetch errors", async () => {
      const error = new GitHubApiError("Commit not found", 404);
      vi.mocked(githubApi.getCommitDetails).mockRejectedValue(error);

      const store = useGitHubStore();
      await store.fetchCommitDetails("testuser", "test-repo", "nonexistent");

      expect(store.commitDetails).toBe(null);
      expect(store.commitDetailsLoading).toBe(false);
      expect(store.commitDetailsError).toBe("Commit not found");
    });
  });

  describe("localStorage Integration", () => {
    it("should load favourites from localStorage on initialization", () => {
      const savedfavourites = [
        {
          sha: "abc123",
          repositoryName: "test-repo",
          username: "testuser",
          commit: {
            message: "Saved commit",
            author: {
              name: "Test User",
              email: "test@example.com",
              date: "2023-01-01T00:00:00Z",
            },
            committer: {
              name: "Test User",
              email: "test@example.com",
              date: "2023-01-01T00:00:00Z",
            },
            tree: {
              sha: "tree123",
              url: "https://api.github.com/repos/user/repo/git/trees/tree123",
            },
          },
          author: null,
          html_url: "https://github.com/user/repo/commit/abc123",
          addedAt: "2023-01-01T12:00:00Z",
        },
      ];

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedfavourites));

      // Create a new store instance to trigger initialization
      setActivePinia(createPinia());
      const store = useGitHubStore();

      expect(store.favouriteCommits).toEqual(savedfavourites);
    });

    it("should handle corrupted localStorage data gracefully", () => {
      mockLocalStorage.getItem.mockReturnValue("invalid json");
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Create a new store instance to trigger initialization
      setActivePinia(createPinia());
      const store = useGitHubStore();

      expect(store.favouriteCommits).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
