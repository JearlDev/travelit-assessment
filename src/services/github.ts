import type {
  Repository,
  Commit,
  CommitDetail,
  ApiError,
  PaginationMeta,
} from "../types";

const GITHUB_API_BASE = "https://api.github.com";
const DEFAULT_PER_PAGE = 30;

// Custom error class for GitHub API errors
export class GitHubApiError extends Error {
  public status: number;
  public documentation_url?: string;

  constructor(message: string, status: number, documentation_url?: string) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
    this.documentation_url = documentation_url;
  }
}

// Parse GitHub API pagination headers
function parseLinkHeader(linkHeader: string | null): {
  next?: string;
  last?: string;
} {
  if (!linkHeader) return {};

  const links: Record<string, string> = {};
  const parts = linkHeader.split(",");

  for (const part of parts) {
    const sections = part.split(";").map((s) => s.trim());
    if (sections.length !== 2) continue;

    const url = sections[0];
    const rel = sections[1];
    const urlMatch = url?.match(/<(.+)>/);
    const relMatch = rel?.match(/rel="(.+)"/);

    if (urlMatch?.[1] && relMatch?.[1]) {
      links[relMatch[1]] = urlMatch[1];
    }
  }

  return links;
}

// Make a request to the GitHub API with error handling
async function githubRequest<T>(
  endpoint: string
): Promise<{ data: T; pagination?: PaginationMeta }> {
  const url = `${GITHUB_API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      // Handle rate limiting
      if (response.status === 403) {
        const resetTime = response.headers.get("X-RateLimit-Reset");
        const resetDate = resetTime
          ? new Date(parseInt(resetTime) * 1000)
          : null;
        const resetMessage = resetDate
          ? ` Rate limit resets at ${resetDate.toLocaleTimeString()}.`
          : "";

        throw new GitHubApiError(
          `API rate limit exceeded.${resetMessage}`,
          403
        );
      }

      // Handle user not found
      if (response.status === 404) {
        throw new GitHubApiError(
          "User or repository not found. Please check the username.",
          404
        );
      }

      // Handle other errors
      const errorData: ApiError = await response.json().catch(() => ({
        message: response.statusText,
        status: response.status,
      }));

      throw new GitHubApiError(
        errorData.message || `Request failed with status ${response.status}`,
        response.status,
        errorData.documentation_url
      );
    }

    const data = await response.json();

    // Parse pagination from Link header
    const linkHeader = response.headers.get("Link");
    const links = parseLinkHeader(linkHeader);

    let pagination: PaginationMeta | undefined;
    if (links.next || links.last) {
      // Extract page info from URL parameters
      const currentUrl = new URL(url);
      const currentPage = parseInt(currentUrl.searchParams.get("page") || "1");
      const perPage = parseInt(currentUrl.searchParams.get("per_page") || "30");

      pagination = {
        page: currentPage,
        perPage,
        hasMore: !!links.next,
      };
    }

    return { data, pagination };
  } catch (error) {
    if (error instanceof GitHubApiError) {
      throw error;
    }

    // Network or other errors
    throw new GitHubApiError(
      error instanceof Error ? error.message : "An unknown error occurred",
      0
    );
  }
}

// GitHub API service with all required endpoints
export const githubApi = {
  // Fetch user's public repositories
  async getUserRepositories(
    username: string,
    page = 1,
    perPage = DEFAULT_PER_PAGE
  ): Promise<{ repositories: Repository[]; pagination?: PaginationMeta }> {
    const { data, pagination } = await githubRequest<Repository[]>(
      `/users/${username}/repos?sort=updated&direction=desc&page=${page}&per_page=${perPage}`
    );

    return { repositories: data, pagination };
  },

  // Fetch commits for a specific repository
  async getRepositoryCommits(
    username: string,
    repo: string,
    page = 1,
    perPage = DEFAULT_PER_PAGE
  ): Promise<{ commits: Commit[]; pagination?: PaginationMeta }> {
    const { data, pagination } = await githubRequest<Commit[]>(
      `/repos/${username}/${repo}/commits?page=${page}&per_page=${perPage}`
    );

    return { commits: data, pagination };
  },

  // Fetch detailed information about a specific commit
  async getCommitDetails(
    username: string,
    repo: string,
    sha: string
  ): Promise<CommitDetail> {
    const { data } = await githubRequest<CommitDetail>(
      `/repos/${username}/${repo}/commits/${sha}`
    );

    return data;
  },

  // Validate if a GitHub username exists
  async validateUser(username: string): Promise<boolean> {
    try {
      await githubRequest(`/users/${username}`);
      return true;
    } catch (error) {
      if (error instanceof GitHubApiError && error.status === 404) {
        return false;
      }
      throw error;
    }
  },
};

// Utility functions for API data processing
export const apiUtils = {
  // Format date for display
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  // Get short commit SHA for display
  getShortSha(sha: string): string {
    return sha.substring(0, 7);
  },

  // Get commit message title (first line)
  getCommitTitle(message: string): string {
    return message.split("\n")[0] || "";
  },

  // Check if commit has body text
  hasCommitBody(message: string): boolean {
    return message.includes("\n") && message.split("\n").length > 1;
  },

  // Get commit body text (everything after first line)
  getCommitBody(message: string): string {
    const lines = message.split("\n");
    return lines.slice(1).join("\n").trim();
  },
};
