// GitHub API Response Types
export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  private: boolean;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface CommitAuthor {
  name: string;
  email: string;
  date: string;
}

export interface Commit {
  sha: string;
  node_id: string;
  url: string;
  html_url: string;
  commit: {
    message: string;
    author: CommitAuthor;
    committer: CommitAuthor;
    tree: {
      sha: string;
      url: string;
    };
  };
  author: GitHubUser | null;
  committer: GitHubUser | null;
}

export interface FileChange {
  sha: string;
  filename: string;
  status:
    | "added"
    | "removed"
    | "modified"
    | "renamed"
    | "copied"
    | "changed"
    | "unchanged";
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  patch?: string;
  previous_filename?: string;
}

export interface CommitStats {
  total: number;
  additions: number;
  deletions: number;
}

export interface CommitDetail extends Commit {
  files?: FileChange[];
  stats: CommitStats;
  parents: Array<{
    sha: string;
    url: string;
    html_url: string;
  }>;
}

// Application State Types
export interface favouriteCommit {
  sha: string;
  repositoryName: string;
  username: string;
  commit: Commit["commit"];
  author: GitHubUser | null;
  html_url: string;
  addedAt: string;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  hasMore: boolean;
  total?: number;
}

export interface ApiError {
  message: string;
  status: number;
  documentation_url?: string;
}

// Sort Options
export type CommitSortOrder = "newest" | "oldest";

// API Response Types
export interface GitHubApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

// Store State Types
export interface RepositoryState {
  repositories: Repository[];
  loading: boolean;
  error: string | null;
  currentUser: string | null;
}

export interface CommitState {
  commits: Commit[];
  currentRepository: string | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  sortOrder: CommitSortOrder;
}

export interface favouriteState {
  favourites: favouriteCommit[];
  loading: boolean;
  error: string | null;
}

export interface CommitDetailState {
  details: CommitDetail | null;
  loading: boolean;
  error: string | null;
}
