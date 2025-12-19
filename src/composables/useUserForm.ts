import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useGitHubStore } from "../stores/github";
import { githubApi, GitHubApiError } from "../services/github";
import { validateGitHubUsername } from "../utils/validation";

interface FormErrors {
  username: string;
}

/**
 * Composable for handling GitHub username form submission and validation
 * @returns Form state, validation, and submission handlers
 */
export function useUserForm() {
  const router = useRouter();
  const githubStore = useGitHubStore();

  // Form state
  const username = ref("");
  const isLoading = ref(false);
  const globalError = ref("");
  const errors = reactive<FormErrors>({ username: "" });

  const validateForm = (): boolean => {
    errors.username = "";

    const validation = validateGitHubUsername(username.value);
    if (!validation.isValid) {
      errors.username = validation.error!;
      return false;
    }

    return true;
  };

  const isFormValid = computed(() => {
    return Boolean(username.value.trim() && !errors.username);
  });

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    const usernameValue = username.value.trim();

    try {
      isLoading.value = true;
      globalError.value = "";

      // Validate user exists
      const userExists = await githubApi.validateUser(usernameValue);
      if (!userExists) {
        errors.username = "GitHub user not found";
        return;
      }

      // Reset store and navigate
      githubStore.resetAll();
      await router.push({
        name: "Repositories",
        params: { username: usernameValue },
      });
    } catch (error) {
      handleSubmissionError(error);
    } finally {
      isLoading.value = false;
    }
  };

  const handleSubmissionError = (error: unknown): void => {
    console.error("Navigation error:", error);

    if (error instanceof GitHubApiError) {
      switch (error.status) {
        case 404:
          errors.username = "GitHub user not found";
          break;
        case 403:
          globalError.value = error.message;
          break;
        default:
          globalError.value = `Error: ${error.message}`;
      }
    } else {
      globalError.value = "An unexpected error occurred. Please try again.";
    }
  };

  const resetForm = (): void => {
    username.value = "";
    errors.username = "";
    globalError.value = "";
    isLoading.value = false;
  };

  const clearErrors = (): void => {
    errors.username = "";
    globalError.value = "";
  };

  return {
    // State
    username,
    isLoading,
    globalError,
    errors,
    // Actions
    handleSubmit,
    resetForm,
    clearErrors,
    // Computed
    isFormValid,
  };
}
