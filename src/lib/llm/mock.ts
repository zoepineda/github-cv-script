import type { LLMProvider, LLMCompletionOptions } from "./types";

/**
 * Mock LLM provider for development.
 * Returns plausible-looking summaries derived from PR metadata
 * so the UI works end-to-end without an API key.
 */
export const mockProvider: LLMProvider = {
  name: "mock",

  async complete(options: LLMCompletionOptions): Promise<string> {
    // Simulate a small delay
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));

    // Extract PR context from the user message
    const userMsg =
      options.messages.find((m) => m.role === "user")?.content ?? "";

    const titleMatch = userMsg.match(/Title:\s*(.+)/);
    const title = titleMatch?.[1]?.trim() ?? "Untitled PR";

    const linesMatch = userMsg.match(/Lines added:\s*(\d+)/);
    const lines = linesMatch?.[1] ?? "0";

    const repoMatch = userMsg.match(/Repository:\s*(.+)/);
    const repo = repoMatch?.[1]?.trim() ?? "unknown";

    // Check what kind of generation is being requested
    const isResumeBullet =
      userMsg.toLowerCase().includes("resume") ||
      userMsg.toLowerCase().includes("bullet");

    if (isResumeBullet) {
      return `Shipped ${cleanTitle(title)} in ${repo}, adding ${lines} lines of production code across the frontend and backend stack.`;
    }

    return `Implemented ${cleanTitle(title)} — a contribution to ${repo} involving ${lines}+ lines of changes that improved the codebase's functionality and maintainability.`;
  },
};

function cleanTitle(title: string): string {
  // Strip common PR prefixes like "Feature/", "Fix/", "Hotfix/"
  return title
    .replace(/^(feature|fix|hotfix|bugfix|chore|refactor)\//i, "")
    .replace(/-/g, " ")
    .trim();
}
