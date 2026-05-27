import type { LLMProvider } from "./types";
import { mockProvider } from "./mock";

export type { LLMProvider, LLMMessage, LLMCompletionOptions } from "./types";

/**
 * Returns the active LLM provider based on environment config.
 *
 * To add a new provider:
 * 1. Create a file like `openai.ts` that exports an LLMProvider
 * 2. Add a case here for the LLM_PROVIDER env var
 *
 * Example .env:
 *   LLM_PROVIDER=openai
 *   OPENAI_API_KEY=sk-...
 */
export function getLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER ?? "mock";

  switch (provider) {
    // case "openai":
    //   return openaiProvider;
    // case "groq":
    //   return groqProvider;
    // case "ollama":
    //   return ollamaProvider;
    default:
      return mockProvider;
  }
}
