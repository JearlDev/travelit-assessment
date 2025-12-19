export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateGitHubUsername = (username: string): ValidationResult => {
  const trimmed = username.trim();

  if (!trimmed) {
    return { isValid: false, error: "Username is required" };
  }

  if (trimmed.length > 39) {
    return {
      isValid: false,
      error: "Username is too long (max 39 characters)",
    };
  }

  // GitHub username validation pattern
  const githubUsernamePattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  if (!githubUsernamePattern.test(trimmed)) {
    return {
      isValid: false,
      error:
        "Invalid GitHub username format. Use only letters, numbers, and hyphens.",
    };
  }

  return { isValid: true };
};
