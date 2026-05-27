/**
 * Provider-agnostic LLM interface.
 *
 * Implement this for any provider: OpenAI, Groq, Ollama, Anthropic, etc.
 * The rest of the app only imports from this file.
 */

export type LLMMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LLMCompletionOptions = {
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
};

export type LLMProvider = {
  readonly name: string;
  complete(options: LLMCompletionOptions): Promise<string>;
};
